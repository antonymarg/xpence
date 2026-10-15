import { Link, LinkProps } from "expo-router"
import React from "react"
import { StyleSheet, View } from "react-native"
import Icon from "../Icon"
import Text from "../Text"

interface SettingsOptionProps {
    label: string
    href: LinkProps['href']
}
function SettingsOption({ label, href }: SettingsOptionProps) {
    return <Link href={href}>
        <View style={styles.container}>
            <Text >{label}</Text>
            <Icon name='chevron-forward' />
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