import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize } from '@utils/Constants';
import CustomizedContainer from './CustomizedContainer';
import CustomizedText from './CustomizedText';
import assets from '@assets';
import { deepMemo } from 'use-hook-kits';

const FilterItem = ({ text = '', disable = false, onPress = null }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={styles.container} onPress={onPress}>
            <CustomizedContainer
                type="peach"
                containerStyle={[styles.container, disable ? styles.disable_color : {}]}
                angle={90}
            >
                {!!onPress && (
                    <Image
                        source={disable ? assets.ic_add : assets.ic_close_circle}
                        style={styles.ic_close}
                    />
                )}
                <CustomizedText type="item" textStyle={disable ? styles.disable_text : styles.text}>
                    {text}
                </CustomizedText>
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
    disable_color: {
        backgroundColor: [Colors.black_01, Colors.black_05],
    },
    text: {
        color: Colors.black_01,
    },
    disable_text: {
        color: Colors.black_12,
    },
    ic_close: {
        width: DefaultSize.M,
        height: DefaultSize.M,
        marginRight: DefaultSize.S,
    },
});

export default deepMemo(FilterItem);
