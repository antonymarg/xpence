import { theme } from '@/constants/theme'
import { capitaliseFirst, formatPrice } from '@/lib/utils'
import { MonthlyInsights } from '@/types/expenses.types'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Card from '../Card'
import Pressable from '../Pressable'
import Text from '../Text'

interface CategoryRankingProps {
    expenses: MonthlyInsights['expenses']
}

function CategoryRanking({ expenses }: CategoryRankingProps) {
    const [showMore, setShowMore] = useState(false)
    return <View style={styles.container}>
        <Text size="lg" weight="bold">
            Categories ranking
        </Text>
        <View style={styles.ranking}>
            {expenses.slice(0, showMore ? expenses.length : 5).map((item, index) => {
                return <Card padding='sm' key={item.category} style={styles.expenses}>
                    <Text>{index + 1}. {capitaliseFirst(item.categoryType)}/ {item.category}</Text>
                    <Text>{formatPrice(item.amount)}</Text>
                </Card>
            })}
        </View>
        {expenses.length > 5 && <Pressable onPress={() => setShowMore(!showMore)} style={styles.showMore}>
            <Text>Show {showMore ? 'less' : 'more'}</Text>
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