import { theme } from '@/constants/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import Modal from './Modal';
import Pressable from './Pressable';
import Text from './Text';
import TextInput from './TextInput';

interface Option<T> { label: string, value: T }

interface DropdownProps<T> {
    heading?: string
    options: Option<T>[]
    value: T
    onValueChange: (newVal: T) => void
}

function Dropdown<T = string>({ value, heading, onValueChange, options }: DropdownProps<T>) {
    const { t } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const textInputText = !value
        ? t('common.selectOption')
        : options.find((option) => option.value === value)?.label ?? value.toString()

    const onValueSelect = (opt: Option<T>) => {
        onValueChange(opt.value)
        setIsModalOpen(false)
    }
    return <>
        <Pressable onPress={() => setIsModalOpen(true)}>
            <TextInput label={heading} readOnly value={textInputText} icon='chevron-down' />
        </Pressable>
        {isModalOpen && <Modal onClose={() => { setIsModalOpen(false) }}>
            <Text size='xl' weight='bold'>{t('dropdown.selectItem')}</Text>
            <ScrollView>
                {options.map((el) => {
                    const isSelected = value === el.value
                    return (
                        <Pressable key={el.label} onPress={() => onValueSelect(el)} style={[style.option, isSelected && style.selectedOption]}>
                            <Text weight={isSelected ? 'bold' : 'regular'}>{el.label}</Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </Modal >}
    </>
}

const style = StyleSheet.create({
    option: {
        paddingVertical: theme.spacing.sm,
        paddingLeft: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm
    },
    selectedOption: {
        backgroundColor: theme.colors.primaryOrangeBg
    },
})

export default Dropdown