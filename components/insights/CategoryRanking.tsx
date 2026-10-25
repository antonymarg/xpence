import { theme } from '@/constants/theme'
import usePriceFormatter from '@/hooks/usePriceFormatter'
import { MonthlyInsights } from '@/types/expenses.types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Card from '../Card'
import Pressable from '../Pressable'
import Text from '../Text'

interface CategoryRankingProps {
    expenses: MonthlyInsights['expenses']
}

function CategoryRanking({ expenses }: CategoryRankingProps) {
    const { t } = useTranslation()
    const formatCurrency = usePriceFormatter()
    const [showMore, setShowMore] = useState(false)
    return <View style={styles.container}>
        <Text size="lg" weight="bold">
            {t('insights.categoryRanking')}
        </Text>
        <View style={styles.ranking}>
            {expenses.slice(0, showMore ? expenses.length : 5).map((item, index) => {
                return <Card padding='sm' key={item.category} style={styles.expenses}>
                    <Text>{index + 1}. {t(`categories.${item.categoryType}`)} / {item.category}</Text>
                    <Text>{formatCurrency(item.amount)}</Text>
                </Card>
            })}
        </View>
        {expenses.length > 5 && <Pressable onPress={() => setShowMore(!showMore)} style={styles.showMore}>
            <Text>{showMore ? t('insights.showLess') : t('insights.showMore')}</Text>
        </Pressable>}

    </View>
}

const styles = StyleSheet.create({
    container: {
        gap: theme.spacing.md
    },
    ranking: {
        gap: theme.spacing.sm
    },
    expenses: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    showMore: {
        marginLeft: 'auto'
    }
})

export default CategoryRanking