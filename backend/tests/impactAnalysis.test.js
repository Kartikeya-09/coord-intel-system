const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const impactAnalysis = require('../services/impactAnalysis');
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

describe('impactAnalysis.run', () => {
  let stakeholder1, stakeholder2, project;

  beforeEach(async () => {
    stakeholder1 = await Stakeholder.create({
      name: 'Alice Manager',
      role: 'project manager',
      contact: { email: 'alice@example.com' }
    });

    stakeholder2 = await Stakeholder.create({
      name: 'Bob Contractor',
      role: 'contractor',
      contact: { email: 'bob@example.com' }
    });

    project = await Project.create({
      name: 'Test Project',
      client: stakeholder1._id
    });
  });

  test('Empty startEntities returns empty result', async () => {
    const result = await impactAnalysis.run({
      projectId: project._id,
      startEntities: [],
      changeEventId: new mongoose.Types.ObjectId(),
      changeEventName: 'Test Event'
    });

    expect(result).toEqual({
      affectedActivityIds: [],
      affectedApprovalIds: [],
      affectedStakeholderIds: [],
      reasoningChains: []
    });
  });

  test('Single-hop traversal', async () => {
    const act1 = await Activity.create({
      name: 'Activity 1',
      project: project._id,
      owner: stakeholder1._id
    });

    const act2 = await Activity.create({
      name: 'Activity 2',
      project: project._id,
      owner: stakeholder2._id
    });

    await Dependency.create({
      project: project._id,
      fromEntity: act1._id,
      fromModel: 'Activity',
      toEntity: act2._id,
      toModel: 'Activity'
    });

    const changeEventId = new mongoose.Types.ObjectId();
    const result = await impactAnalysis.run({
      projectId: project._id,
      startEntities: [{ entity: act1._id, model: 'Activity' }],
      changeEventId,
      changeEventName: 'Material Change'
    });

    expect(result.affectedActivityIds.length).toBe(2);
    expect(result.affectedActivityIds).toContain(act1._id.toString());
    expect(result.affectedActivityIds).toContain(act2._id.toString());
    expect(result.affectedStakeholderIds).toContain(stakeholder1._id.toString());
    expect(result.affectedStakeholderIds).toContain(stakeholder2._id.toString());
    expect(result.reasoningChains.length).toBe(2);

    // act1 reasoning chain has 1 step
    const act1Chain = result.reasoningChains.find((c) => c.entity === act1._id.toString());
    expect(act1Chain.steps.length).toBe(1);
    expect(act1Chain.steps[0].fromModel).toBe('ChangeEvent');

    // act2 reasoning chain has 2 steps
    const act2Chain = result.reasoningChains.find((c) => c.entity === act2._id.toString());
    expect(act2Chain.steps.length).toBe(2);
  });

  test('Multi-hop traversal (Activity -> Activity -> Approval)', async () => {
    const act1 = await Activity.create({
      name: 'Design Spec',
      project: project._id,
      owner: stakeholder1._id
    });

    const act2 = await Activity.create({
      name: 'Procurement Order',
      project: project._id,
      owner: stakeholder2._id
    });

    const app1 = await Approval.create({
      title: 'Budget Sign-off',
      project: project._id,
      owner: stakeholder1._id
    });

    await Dependency.create({
      project: project._id,
      fromEntity: act1._id,
      fromModel: 'Activity',
      toEntity: act2._id,
      toModel: 'Activity'
    });

    await Dependency.create({
      project: project._id,
      fromEntity: act2._id,
      fromModel: 'Activity',
      toEntity: app1._id,
      toModel: 'Approval'
    });

    const result = await impactAnalysis.run({
      projectId: project._id,
      startEntities: [{ entity: act1._id, model: 'Activity' }],
      changeEventId: new mongoose.Types.ObjectId(),
      changeEventName: 'Design Scope Change'
    });

    expect(result.affectedActivityIds).toHaveLength(2);
    expect(result.affectedApprovalIds).toHaveLength(1);
    expect(result.affectedApprovalIds[0]).toBe(app1._id.toString());

    const appChain = result.reasoningChains.find((c) => c.entity === app1._id.toString());
    expect(appChain.steps).toHaveLength(3);
  });

  test('Isolated entities with no dependencies are not included', async () => {
    const act1 = await Activity.create({
      name: 'Active Task',
      project: project._id,
      owner: stakeholder1._id
    });

    const isolatedAct = await Activity.create({
      name: 'Unrelated Task',
      project: project._id,
      owner: stakeholder2._id
    });

    const result = await impactAnalysis.run({
      projectId: project._id,
      startEntities: [{ entity: act1._id, model: 'Activity' }],
      changeEventId: new mongoose.Types.ObjectId(),
      changeEventName: 'Change'
    });

    expect(result.affectedActivityIds).toContain(act1._id.toString());
    expect(result.affectedActivityIds).not.toContain(isolatedAct._id.toString());
  });

  test('Deduplication: two paths to same entity produce one result entry', async () => {
    const seed1 = await Activity.create({ name: 'Seed 1', project: project._id, owner: stakeholder1._id });
    const seed2 = await Activity.create({ name: 'Seed 2', project: project._id, owner: stakeholder1._id });
    const shared = await Activity.create({ name: 'Shared Target', project: project._id, owner: stakeholder2._id });

    await Dependency.create({
      project: project._id,
      fromEntity: seed1._id,
      fromModel: 'Activity',
      toEntity: shared._id,
      toModel: 'Activity'
    });

    await Dependency.create({
      project: project._id,
      fromEntity: seed2._id,
      fromModel: 'Activity',
      toEntity: shared._id,
      toModel: 'Activity'
    });

    const result = await impactAnalysis.run({
      projectId: project._id,
      startEntities: [
        { entity: seed1._id, model: 'Activity' },
        { entity: seed2._id, model: 'Activity' }
      ],
      changeEventId: new mongoose.Types.ObjectId(),
      changeEventName: 'Dual Seed Change'
    });

    const sharedMatches = result.affectedActivityIds.filter((id) => id === shared._id.toString());
    expect(sharedMatches).toHaveLength(1);
  });
});
