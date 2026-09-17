const mongoose = require('mongoose');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const Stakeholder = require('../models/Stakeholder');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Approval = require('../models/Approval');
const Dependency = require('../models/Dependency');
const ProjectMemory = require('../models/ProjectMemory');

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

describe('POST /api/v1/change-events (Integration)', () => {
  let client, designer, architect, vendor, contractor, pm;
  let project;
  let actSelection, actOrder, actSchedule, appBudget;

  beforeEach(async () => {
    // 1. Create Stakeholders
    client = await Stakeholder.create({ name: 'Maya Patel', role: 'client' });
    designer = await Stakeholder.create({ name: 'Aria Shen', role: 'interior designer' });
    architect = await Stakeholder.create({ name: 'James Okoye', role: 'architect' });
    vendor = await Stakeholder.create({ name: 'Ravi Logistics', role: 'vendor' });
    contractor = await Stakeholder.create({ name: 'BuildFast Co', role: 'contractor' });
    pm = await Stakeholder.create({ name: 'Leila Hassan', role: 'project manager' });

    // 2. Create Project
    project = await Project.create({
      name: 'Patel Residence Fit-Out',
      client: client._id,
      phase: 'Construction'
    });

    // 3. Create Activities & Approval
    actSelection = await Activity.create({
      name: 'Flooring Material Selection',
      project: project._id,
      owner: designer._id,
      status: 'complete'
    });

    actOrder = await Activity.create({
      name: 'Flooring Material Order',
      project: project._id,
      owner: vendor._id,
      status: 'pending'
    });

    actSchedule = await Activity.create({
      name: 'Installation Schedule Planning',
      project: project._id,
      owner: contractor._id,
      status: 'pending'
    });

    appBudget = await Approval.create({
      title: 'Budget Approval for Materials',
      project: project._id,
      owner: client._id,
      status: 'approved'
    });

    // 4. Create Dependencies
    await Dependency.create({
      project: project._id,
      fromEntity: actSelection._id,
      fromModel: 'Activity',
      toEntity: actOrder._id,
      toModel: 'Activity'
    });

    await Dependency.create({
      project: project._id,
      fromEntity: actOrder._id,
      fromModel: 'Activity',
      toEntity: actSchedule._id,
      toModel: 'Activity'
    });

    await Dependency.create({
      project: project._id,
      fromEntity: actOrder._id,
      fromModel: 'Activity',
      toEntity: appBudget._id,
      toModel: 'Approval'
    });
  });

  test('POST /change-events missing required fields returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/change-events')
      .send({ description: 'Incomplete' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /change-events with no linkedEntities returns empty impact result', async () => {
    const res = await request(app)
      .post('/api/v1/change-events')
      .send({
        type: 'issue',
        description: 'Minor site note',
        sourceStakeholder: designer._id,
        project: project._id,
        linkedEntities: []
      });

    expect(res.status).toBe(201);
    expect(res.body.impactResult).toBeDefined();
    expect(res.body.impactResult.affectedActivities).toEqual([]);
  });

  test('POST /change-events demo scenario produces full orchestration', async () => {
    const res = await request(app)
      .post('/api/v1/change-events')
      .send({
        type: 'material change',
        description: 'Flooring material changed from engineered wood to Italian marble',
        sourceStakeholder: designer._id,
        project: project._id,
        linkedEntities: [
          { entity: actOrder._id, model: 'Activity' },
          { entity: appBudget._id, model: 'Approval' }
        ]
      });

    expect(res.status).toBe(201);
    expect(res.body.type).toBe('material change');
    expect(res.body.impactResult).toBeDefined();

    const impact = res.body.impactResult;
    expect(impact.affectedActivities.length).toBeGreaterThanOrEqual(2);
    expect(impact.affectedApprovals.length).toBeGreaterThanOrEqual(1);
    expect(impact.affectedStakeholders.length).toBeGreaterThanOrEqual(3);

    // Check ProjectMemory entries
    const memories = await ProjectMemory.find({ project: project._id });
    expect(memories.length).toBeGreaterThanOrEqual(4);
    const eventTypes = memories.map((m) => m.eventType);
    expect(eventTypes).toContain('change_event_created');
    expect(eventTypes).toContain('impact_result_produced');
    expect(eventTypes).toContain('action_created');
  });
});
