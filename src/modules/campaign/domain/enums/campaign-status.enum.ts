/************Campaign Lifecycle (State Machine) **************
 * ************** DRAFT
 * **************** ↓ submit
 * ************** IN_REVIEW
 * **************** ↓ approve
 * ************** APPROVED
 * **************** ↓ start
 * ************** RUNNING
 * **************** ↓ complete
 * ************** COMPLETED
 * **************** ↓ archive
 * ************** ARCHIVED
 */
export enum CampaignStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  RUNNING = 'running',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}
