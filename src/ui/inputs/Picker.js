import React, { useState } from 'react'
import {
    PickerItem as CorePickerItem,
} from '@apollosproject/ui-kit'

import DropdownWrapper from './DropdownWrapper'

import PickerList from '@apollosproject/ui-kit/src/inputs/Picker/PickerList'

const Picker = (props) => {
    const [focused, setFocused] = useState(false)
    const {
        value,
        ...pickerProps
    } = props

    return (
        <DropdownWrapper
            {...props}
            handleOnPress={() => setFocused(!focused)}
            focused={focused} >
            <PickerList
                {...pickerProps}
                value={value}
                focused={focused}
                onRequestClose={() => setFocused(false)}
            />
        </DropdownWrapper >
    )
}

export default Picker
export const PickerItem = CorePickerItem