import { formatPrice } from '@/lib/utils'
import React from 'react'
import { StyleSheet } from 'react-native'
import Card from '../Card'
import Text from '../Text'

interface TotalCardProps {
    sum: number
    budget: number
}
const getText = (remaining: number) => {
    if (remaining === 0) return 'Right on budget!'
    if (remaining > 0) return `${formatPrice(remaining)} under budget`
    return `${formatPrice(remaining)} over budget`
}

function TotalCard({ sum, budget }: TotalCardProps) {
    const remaining = budget - sum
    return <Card style={styles.container}>
        <Text size='title' weight='bold'>{formatPrice(sum)}</Text>
        <Text size='sm'>{getText(remaining)}</Text>
    </Card>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default TotalCard