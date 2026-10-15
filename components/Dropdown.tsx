import React from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';

interface DropdownProps extends PickerSelectProps { }

function Dropdown({ value, onValueChange, items }: DropdownProps) {
    return <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={items}

    />
}

const style = StyleSheet.create({

})

export default Dropdown