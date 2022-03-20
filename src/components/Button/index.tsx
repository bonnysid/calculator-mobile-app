import { TouchableHighlight, StyleSheet, View, Text } from 'react-native';
import React, { FC } from 'react';

export enum ButtonColorScheme {
    ORANGE = 'orange',
    GRAY = 'gray',
    DEFAULT = 'default',
}

interface IButtonProps {
    colorScheme?: ButtonColorScheme;
    onClick?: () => void;
    twoWidth?: boolean;
}

const Button: FC<IButtonProps> = ({
        colorScheme = ButtonColorScheme.DEFAULT,
        children,
        onClick,
        twoWidth,
}) => {
    return (
        <TouchableHighlight onPress={onClick}>
            <View style={[style.shared, style[colorScheme], twoWidth && style.twoWidth]}>
                <Text style={{ color: style[colorScheme].color, fontSize: style.shared.fontSize }}>
                    {children}
                </Text>
            </View>
        </TouchableHighlight>
    )
}

const style = StyleSheet.create({
    shared: {
        borderRadius: 40,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 30,
        margin: 5,
    },

    orange: {
        backgroundColor: '#f58b49',
        color: '#fff',
    },

    gray: {
        backgroundColor: '#a1a1a1',
        color: '#333',
    },

    default: {
        backgroundColor: '#424242',
        color: '#fff',
    },

    twoWidth: {
        width: 170,
        alignItems: 'flex-start',
        paddingLeft: 25
    }
})

export default Button;
