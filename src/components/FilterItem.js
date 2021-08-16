import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize } from '@utils/Constants';
import CustomizedContainer from './CustomizedContainer';
import CustomizedText from './CustomizedText';

const FilterItem = ({ text = '', disable = false }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container}>
            <CustomizedContainer type="cell">
                <CustomizedText type="item">{text}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: DefaultSize.XS,
    },
});

export default React.memo(FilterItem);
