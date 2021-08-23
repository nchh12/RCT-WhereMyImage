import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import Strings from '@utils/Strings';
import assets from '@assets';
import { DefaultSize } from '@utils/Constants';
import { useFilters } from '@hooks';
import DeviceConfigs from '@utils/DeviceConfigs';
import { push } from '@navigation/AppNavigation';
import { deepMemo } from 'use-hook-kits';

const InputScreen = props => {
    const { navigation } = props;

    const _renderTitle = () => (
        <CustomizedText type="title" textStyle={styles.text_title}>
            {Strings.title_input}
        </CustomizedText>
    );

    const _renderStartButton = () => (
        <View style={[styles.container_bar, styles.container_start]}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    push({ screen: 'ResultScreen', navigation });
                }}
            >
                <CustomizedContainer type="peach" containerStyle={SharedStyles.bar}>
                    <CustomizedText type="item" size={16}>
                        {Strings.start_processing}
                    </CustomizedText>
                </CustomizedContainer>
            </TouchableOpacity>
        </View>
    );

    return (
        <CustomizedContainer type="main_screen">
            <LottieView
                source={assets.bar_seeking}
                style={styles.foreground}
                autoPlay={true}
                loop={true}
            />
            <View style={styles.container_overlay}>
                {_renderTitle()}
                <ListFilters />
                <InputFilters />
                {_renderStartButton()}
            </View>
        </CustomizedContainer>
    );
};

const InputFilters = deepMemo(() => {
    const { addFilter } = useFilters();
    const [textFilter, setTextFilter] = useState('');

    const onChangeText = text => {
        setTextFilter(text);
    };

    const onPressAdd = () => {
        addFilter(textFilter);
        setTextFilter('');
    };

    const isTyping = textFilter !== '';
    return (
        <View style={[styles.container_bar, styles.container_input]}>
            <TextInput
                style={[SharedStyles.bar, styles.input]}
                onChangeText={onChangeText}
                value={textFilter}
                placeholder={Strings.input_filter_placeholder}
                numberOfLines={1}
                keyboardType={'default'}
            />
            <TouchableOpacity activeOpacity={0.7} onPress={isTyping ? onPressAdd : null}>
                <CustomizedContainer
                    type={isTyping ? 'peach' : 'gray'}
                    containerStyle={SharedStyles.bar}
                >
                    <CustomizedText type="item" size={20}>
                        +
                    </CustomizedText>
                </CustomizedContainer>
            </TouchableOpacity>
        </View>
    );
});

const ListFilters = deepMemo(() => {
    const { getListFilters, enableFilter, removeFilter } = useFilters();
    return (
        <View>
            <FlatList
                style={styles.container_filter}
                data={getListFilters() || []}
                keyExtractor={(item, index) => `key_filter_${item?.label}_${index}`}
                renderItem={({ index, item }) => {
                    const { label, disable } = item || {};
                    return (
                        <FilterItem
                            text={`#${label?.toLowerCase()}`}
                            disable={disable}
                            onPress={() => {
                                if (disable) {
                                    enableFilter(index);
                                } else {
                                    removeFilter(index);
                                }
                            }}
                        />
                    );
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    );
});

const styles = StyleSheet.create({
    foreground: {
        width: '90%',
        height: 'auto',
    },
    container_overlay: {
        ...SharedStyles.shadow,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '70%',
        backgroundColor: Colors.white,
        paddingVertical: DefaultSize.L,
        borderTopLeftRadius: DefaultSize.XL,
        borderTopRightRadius: DefaultSize.XL,
    },
    container_bar: {
        marginTop: DefaultSize.S,
        paddingHorizontal: DefaultSize.M,
    },
    container_start: {
        width: '100%',
        position: 'absolute',
        bottom: (DeviceConfigs.isIphoneX() ? DefaultSize.L : 0) + DefaultSize.XL,
    },
    container_input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        ...SharedStyles.shadow,
        backgroundColor: Colors.black_03,
        color: Colors.dark,
        width: '80%',
        fontWeight: 'bold',
    },
    position_bt_add: {
        position: 'absolute',
        width: '30%',
        bottom: DefaultSize.M,
        right: DefaultSize.M,
    },
    container_bt_add: {
        borderRadius: DefaultSize.S,
        backgroundColor: [Colors.black_09, Colors.black_05],
    },
    text_title: {
        marginHorizontal: DefaultSize.L,
    },
    container_filter: {
        paddingHorizontal: DefaultSize.S,
        width: '100%',
        height: 'auto',
    },
    bt_add: {},
});

export default deepMemo(InputScreen);
