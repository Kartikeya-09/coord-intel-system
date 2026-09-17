const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Stakeholder = require('../models/Stakeholder');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Approval = require('../models/Approval');
const Dependency = require('../models/Dependency');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Core Integration Tests', () => {
  let stakeholder, project;

  beforeEach(async () => {
    stakeholder = await Stakeholder.create({ name: 'Maya Patel', role: 'client' });
    project = await Project.create({ name: 'Fit-Out', client: stakeholder._id });
  });

  test('PUT /approvals/:id blocking logic (set to pending blocks, approved unblocks)', async () => {
    const approval = await Approval.create({
      title: 'Structural Approval',
      project: project._id,
      owner: stakeholder._id,
      status: 'approved'
    });

    const activity = await Activity.create({
      name: 'Foundation Work',
      project: project._id,
      owner: stakeholder._id,
      status: 'pending',
      isBlocked: false
    });

    await Dependency.create({
      project: project._id,
      fromEntity: approval._id,
      fromModel: 'Approval',
      toEntity: activity._id,
      toModel: 'Activity'
    });

    // 1. Change approval status to pending -> downstream activity should be blocked
    const res1 = await request(app)
      .put(`/api/v1/approvals/${approval._id}`)
      .send({ status: 'pending' });

    expect(res1.status).toBe(200);

    const updatedAct1 = await Activity.findById(activity._id);
    expect(updatedAct1.isBlocked).toBe(true);
    expect(updatedAct1.status).toBe('blocked');

    // 2. Change approval status back to approved -> downstream activity should be unblocked
    const res2 = await request(app)
      .put(`/api/v1/approvals/${approval._id}`)
      .send({ status: 'approved' });

    expect(res2.status).toBe(200);

    const updatedAct2 = await Activity.findById(activity._id);
    expect(updatedAct2.isBlocked).toBe(false);
    expect(updatedAct2.status).toBe('pending');
  });

  test('POST /dependencies cycle detection (A->B->C, attempt C->A returns 422 with cycle path)', async () => {
    const actA = await Activity.create({ name: 'Activity A', project: project._id, owner: stakeholder._id });
    const actB = await Activity.create({ name: 'Activity B', project: project._id, owner: stakeholder._id });
    const actC = await Activity.create({ name: 'Activity C', project: project._id, owner: stakeholder._id });

    // Create A -> B
    await request(app).post('/api/v1/dependencies').send({
      project: project._id,
      fromEntity: actA._id,
      fromModel: 'Activity',
      toEntity: actB._id,
      toModel: 'Activity'
    });

    // Create B -> C
    await request(app).post('/api/v1/dependencies').send({
      project: project._id,
      fromEntity: actB._id,
      fromModel: 'Activity',
      toEntity: actC._id,
      toModel: 'Activity'
    });

    // Attempt C -> A (should fail with 422)
    const resCycle = await request(app).post('/api/v1/dependencies').send({
      project: project._id,
      fromEntity: actC._id,
      fromModel: 'Activity',
      toEntity: actA._id,
      toModel: 'Activity'
    });

    expect(resCycle.status).toBe(422);
    expect(resCycle.body.error.message).toContain('Dependency would create a cycle');
    expect(resCycle.body.error.message).toContain('Activity C');
    expect(resCycle.body.error.message).toContain('Activity A');
  });
});
