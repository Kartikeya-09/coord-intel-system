import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb, disconnectDb } from '../utils/connectDb.js';
import Stakeholder from '../models/Stakeholder.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import Approval from '../models/Approval.js';
import Dependency from '../models/Dependency.js';
import ChangeEvent from '../models/ChangeEvent.js';
import ImpactResult from '../models/ImpactResult.js';
import Alert from '../models/Alert.js';
import Action from '../models/Action.js';
import User from '../models/User.js';
import impactAnalysis from '../services/impactAnalysis.js';
import { logMemory } from '../utils/projectMemoryLogger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function findOrCreateStakeholder(stakeholder) {
  return Stakeholder.findOneAndUpdate(
    { 'contact.email': stakeholder.contact.email },
    { $setOnInsert: stakeholder },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
}

async function upsertUser(account) {
  const existingUser = await User.findOne({ email: account.email });
  if (!existingUser) {
    return User.create(account);
  }

  existingUser.name = account.name;
  existingUser.role = account.role;
  existingUser.stakeholder = account.stakeholder;
  existingUser.password = account.password;
  return existingUser.save();
}

async function seedDemo() {
  try {
    await connectDb();

    // Keep existing projects and records intact when seeding accounts.
    const client = await findOrCreateStakeholder({
      name: 'Maya Patel',
      role: 'client',
      contact: { email: 'maya.patel@example.com', phone: '+15550192' }
    });

    const designer = await findOrCreateStakeholder({
      name: 'Aria Shen',
      role: 'interior designer',
      contact: { email: 'aria.shen@example.com', phone: '+15550193' }
    });

    const architect = await findOrCreateStakeholder({
      name: 'James Okoye',
      role: 'architect',
      contact: { email: 'james.okoye@example.com', phone: '+15550194' }
    });

    const vendor = await findOrCreateStakeholder({
      name: 'Ravi Logistics',
      role: 'vendor',
      contact: { email: 'ravi.logistics@example.com', phone: '+15550195' }
    });

    const contractor = await findOrCreateStakeholder({
      name: 'BuildFast Co',
      role: 'contractor',
      contact: { email: 'buildfast@example.com', phone: '+15550196' }
    });

    const pm = await findOrCreateStakeholder({
      name: 'Leila Hassan',
      role: 'project manager',
      contact: { email: 'leila.hassan@example.com', phone: '+15550197' }
    });

    console.log('✓ Existing stakeholders reused or missing stakeholders created');

    // 2. Create User Login Accounts for each Stakeholder
    await upsertUser({
      name: 'Leila Hassan (Project Manager)',
      email: 'leila.hassan@example.com',
      password: 'password123',
      role: 'admin',
      stakeholder: pm._id
    });

    await upsertUser({
      name: 'Maya Patel (Client)',
      email: 'maya.patel@example.com',
      password: 'password123',
      role: 'client',
      stakeholder: client._id
    });

    await upsertUser({
      name: 'Aria Shen (Interior Designer)',
      email: 'aria.shen@example.com',
      password: 'password123',
      role: 'stakeholder',
      stakeholder: designer._id
    });

    await upsertUser({
      name: 'James Okoye (Architect)',
      email: 'james.okoye@example.com',
      password: 'password123',
      role: 'stakeholder',
      stakeholder: architect._id
    });

    await upsertUser({
      name: 'Ravi Logistics (Vendor)',
      email: 'ravi.logistics@example.com',
      password: 'password123',
      role: 'stakeholder',
      stakeholder: vendor._id
    });

    await upsertUser({
      name: 'BuildFast Co (Site Contractor)',
      email: 'buildfast@example.com',
      password: 'password123',
      role: 'stakeholder',
      stakeholder: contractor._id
    });

    console.log('✓ Seeded 6 user accounts without duplicating existing emails');

    if (process.env.SEED_DEMO !== 'true') {
      console.log('Demo project data was left unchanged. Set SEED_DEMO=true to seed the full demo scenario.');
      return;
    }

    // 3. Create 1 Project with Stakeholders & Responsibility Areas
    const project = await Project.create({
      name: 'Patel Residence Fit-Out',
      client: client._id,
      phase: 'Construction',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-11-30'),
      stakeholders: [
        { stakeholder: client._id, responsibilityAreas: ['Budget Approval', 'Client Sign-off'] },
        { stakeholder: designer._id, responsibilityAreas: ['Finishes', 'Furniture & Fixtures', 'Flooring'] },
        { stakeholder: architect._id, responsibilityAreas: ['Structural Plans', 'Permits'] },
        { stakeholder: vendor._id, responsibilityAreas: ['Material Procurement', 'Logistics'] },
        { stakeholder: contractor._id, responsibilityAreas: ['On-site Construction', 'Schedule'] },
        { stakeholder: pm._id, responsibilityAreas: ['Overall Project Coordination', 'Risk Management'] }
      ]
    });

    console.log(`✓ Created Project: ${project.name}`);

    // 4. Create 4 Activities
    const actSelection = await Activity.create({
      project: project._id,
      name: 'Flooring Material Selection',
      description: 'Select final flooring tiles & wood samples',
      owner: designer._id,
      status: 'complete',
      dueDate: new Date('2026-02-15')
    });

    const actOrder = await Activity.create({
      project: project._id,
      name: 'Flooring Material Order',
      description: 'Place purchase order for flooring materials',
      owner: vendor._id,
      status: 'pending',
      dueDate: new Date('2026-03-01')
    });

    const actSchedule = await Activity.create({
      project: project._id,
      name: 'Installation Schedule Planning',
      description: 'Draft site contractor installation sequence',
      owner: contractor._id,
      status: 'pending',
      dueDate: new Date('2026-03-15')
    });

    const actPrep = await Activity.create({
      project: project._id,
      name: 'Site Preparation',
      description: 'Clear floor sub-surfaces and prep tools',
      owner: contractor._id,
      status: 'pending',
      dueDate: new Date('2026-03-10')
    });

    console.log('✓ Created 4 Activities');

    // 5. Create 1 Approval
    const appBudget = await Approval.create({
      project: project._id,
      title: 'Budget Approval for Materials',
      description: 'Client sign-off for material costs',
      owner: client._id,
      status: 'approved'
    });

    console.log('✓ Created 1 Approval');

    // 6. Create 3 Dependencies
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

    console.log('✓ Created 3 Dependencies');

    // 7. Create 1 ChangeEvent & Run Full Orchestration
    const changeEventDesc = 'Flooring material changed from engineered wood to Italian marble';
    const changeEvent = new ChangeEvent({
      project: project._id,
      type: 'material change',
      description: changeEventDesc,
      sourceStakeholder: designer._id,
      linkedEntities: [
        { entity: actOrder._id, model: 'Activity' },
        { entity: appBudget._id, model: 'Approval' }
      ]
    });
    await changeEvent.save();

    await logMemory({
      projectId: project._id,
      eventType: 'change_event_created',
      summary: `Change event logged: "${changeEventDesc}"`,
      actorType: 'stakeholder',
      actorRef: designer._id
    });

    // Run Impact Analysis
    const analysisResult = await impactAnalysis.run({
      projectId: project._id,
      startEntities: changeEvent.linkedEntities,
      changeEventId: changeEvent._id,
      changeEventName: changeEventDesc
    });

    const impactResult = new ImpactResult({
      changeEvent: changeEvent._id,
      project: project._id,
      affectedActivities: analysisResult.affectedActivityIds,
      affectedApprovals: analysisResult.affectedApprovalIds,
      affectedStakeholders: analysisResult.affectedStakeholderIds,
      reasoningChains: analysisResult.reasoningChains
    });
    await impactResult.save();

    changeEvent.impactResult = impactResult._id;
    await changeEvent.save();

    await logMemory({
      projectId: project._id,
      eventType: 'impact_result_produced',
      summary: `Impact analysis completed: ${analysisResult.affectedActivityIds.length} activities, ${analysisResult.affectedApprovalIds.length} approvals, and ${analysisResult.affectedStakeholderIds.length} stakeholders affected`,
      actorType: 'system'
    });

    // Create Alerts & Actions
    const entityOwnerMap = new Map([
      [actSelection._id.toString(), designer._id.toString()],
      [actOrder._id.toString(), vendor._id.toString()],
      [actSchedule._id.toString(), contractor._id.toString()],
      [actPrep._id.toString(), contractor._id.toString()],
      [appBudget._id.toString(), client._id.toString()]
    ]);

    for (const chain of analysisResult.reasoningChains) {
      const ownerId = entityOwnerMap.get(chain.entity.toString());
      if (!ownerId) continue;

      const readableSteps = chain.steps.map(
        (step) => `${step.fromModel}: ${step.fromName} → ${step.toModel}: ${step.toName}`
      );

      await Alert.create({
        stakeholder: ownerId,
        project: project._id,
        changeEvent: changeEvent._id,
        changeEventName: changeEventDesc,
        impactResult: impactResult._id,
        affectedEntity: {
          entity: chain.entity,
          model: chain.model,
          name: chain.name
        },
        reasoningChain: readableSteps
      });

      await Action.create({
        project: project._id,
        title: `Review impact: ${chain.name}`,
        description: `Auto-generated action from change event: ${changeEventDesc}`,
        assignee: ownerId,
        isAutoGenerated: true,
        sourceImpactResult: impactResult._id,
        status: 'open'
      });

      await logMemory({
        projectId: project._id,
        eventType: 'action_created',
        summary: `Auto-generated action created: "Review impact: ${chain.name}"`,
        actorType: 'system'
      });
    }

    console.log('\n========================================');
    console.log('DEMO SCENARIO & USER ACCOUNTS SEEDED!');
    console.log('========================================');
    console.log(`Project ID: ${project._id}`);
    console.log(`Created Users: 6 (Admin, Client, Designer, Architect, Vendor, Contractor)`);
    console.log(`Default Password for all accounts: password123`);
    console.log('========================================\n');
  } catch (err) {
    console.error('Error seeding demo script:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDb();
  }
}

seedDemo();
