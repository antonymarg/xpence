import { theme } from "@/constants/theme"
import { Link, LinkProps } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"
import Icon from "../Icon"
import Text from "../Text"

interface SettingsOptionProps {
    label: string
    href: LinkProps['href']
    danger?: boolean
}
function SettingsOption({ label, href, danger = false }: SettingsOptionProps) {
    return <Link href={href}>
        <View style={styles.container}>
            <Text color={danger ? "error" : undefined}>{label}</Text>
            <Icon name='chevron-forward' color={danger ? theme.colors.error : undefined} />
        </View>
    </Link>
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default SettingsOption
