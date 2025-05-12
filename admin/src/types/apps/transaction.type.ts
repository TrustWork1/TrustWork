import { TEachProject, TEachProjectBidding } from './projects.type'

export type TEachTransaction = {
  escrow_id: string
  status: string
  transaction_type: string
  bid?: TEachProjectBidding
  project: TEachProject
  created_at: string
  transection_amount?: string
}
