import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { TextSize } from '@utils/Constants';
import Colors from '@utils/Colors';

const CustomizedText = ({ type = null, textStyle = {}, children, size = null }) => {
    size = typeof size === 'number' ? size : TextSize[size];

    const appliedType = styles[type] || {};
    const appliedSize = !size ? {} : { fontSize: size };

    return <Text style={[appliedType, appliedSize, textStyle]}>{children}</Text>;
};

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: TextSize.H1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: TextSize.H4,
        color: Colors.dark,
    },
    item: {
        fontWeight: 'bold',
        fontSize: TextSize.title,
        color: Colors.white,
    },
});

export default React.memo(CustomizedText);
