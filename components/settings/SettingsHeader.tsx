import { Link, LinkProps } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"
import Icon from "../Icon"
import Text from "../Text"

interface SettingsOptionProps {
    label: string
    href: LinkProps['href']
}
function SettingsHeader({ label, href }: SettingsOptionProps) {
    return <Link href={href}>
        <View style={styles.container}>
            <Icon name='chevron-back' />
            <Text size='xl' weight="bold">{label}</Text>
        </View>
    </Link>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    }
})

export default SettingsHeader