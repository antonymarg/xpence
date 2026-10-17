import { theme } from '@/constants/theme';
import React, { useState } from 'react';
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
    const [textInputText, setTextInputText] = useState(() => {
        if (!value) return 'Please select an options'
        const option = options.find((opt) => opt.value === value)
        return option?.label ?? value.toString()
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const onValueSelect = (opt: Option<T>) => {
        setTextInputText(opt.label)
        onValueChange(opt.value)
        setIsModalOpen(false)
    }
    return <>
        <Pressable onPress={() => setIsModalOpen(true)}>
            <TextInput label={heading} readOnly value={textInputText} icon='chevron-down' />
        </Pressable>
        {isModalOpen && <Modal onClose={() => { setIsModalOpen(false) }} style={style.modal}>
            <Text size='xl' weight='bold'> Select an item</Text>
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
    modal: {
        maxHeight: '80%'
    }
})

export default Dropdown