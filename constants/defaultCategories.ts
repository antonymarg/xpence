const NEEDS = ['housing', 'utilities', 'groceries', 'transportation', 'healthcare', 'insurance'] as const
const WANTS = ['takeout', "entertainment", "shopping", "subscriptions", "personal care", "hobbies", "gifts", "travel"] as const
const SAVINGS = ['emergencyFund', 'investments'] as const

export const DEFAULT_CATEGORIES = {
    needs: NEEDS,
    wants: WANTS,
    savings: SAVINGS
} as const