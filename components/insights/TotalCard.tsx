import { formatPrice } from '@/lib/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import Card from '../Card'
import Text from '../Text'

interface TotalCardProps {
    sum: number
    budget: number
}
function TotalCard({ sum, budget }: TotalCardProps) {
    const { t } = useTranslation()
    const remaining = budget - sum
    const status = remaining === 0
        ? t('insights.rightOnBudget')
        : remaining > 0
            ? t('insights.underBudget', { amount: formatPrice(remaining) })
            : t('insights.overBudget', { amount: formatPrice(Math.abs(remaining)) })
    return <Card style={styles.container}>
        <Text size='title' weight='bold'>{formatPrice(sum)}</Text>
        <Text size='sm'>{status}</Text>
    </Card>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default TotalCard