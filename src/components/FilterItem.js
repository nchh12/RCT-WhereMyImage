import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize } from '@utils/Constants';
import CustomizedContainer from './CustomizedContainer';
import CustomizedText from './CustomizedText';
import assets from '@assets';

const FilterItem = ({ text = '', disable = false, onPress = () => {} }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={onPress}>
            <CustomizedContainer type="cell" containerStyle={styles.container} angle={90}>
                <Image source={assets.ic_close_circle} style={styles.ic_close} />
                <CustomizedText type="item">{text}</CustomizedText>
            </CustomizedContainer>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: DefaultSize.XS,
        marginHorizontal: DefaultSize.XXS,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ic_close: {
        width: DefaultSize.M,
        height: DefaultSize.M,
        marginRight: DefaultSize.S,
    },
});

export default React.memo(FilterItem);
