import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import Strings from '@utils/Strings';
import assets from '@assets';
import { DefaultSize } from '@utils/Constants';
import { useFilters, useLabelmages } from '@hooks';

import { push } from '@navigation/AppNavigation';
import { deepMemo } from 'use-hook-kits';
import styles from './styles';
const ScrollableTabView = require('react-native-scrollable-tab-view');

const InputScreen = ({ navigation }) => {
    const { setTextDesc } = useFilters();

    return (
        <CustomizedContainer type="main_screen">
            <LottieView
                source={assets.bar_seeking}
                style={styles.foreground}
                autoPlay={true}
                loop={true}
            />
            <View style={styles.container_overlay}>
                <ScrollableTabView
                    onChangeTab={({ i }) => {
                        setTextDesc('');
                    }}
                    tabBarUnderlineStyle={{
                        backgroundColor: Colors.base_1,
                        borderRadius: DefaultSize.M,
                    }}
                    tabBarActiveTextColor={Colors.dark}
                    tabBarInactiveTextColor={Colors.black_12}
                >
                    <DescriptionPage tabLabel="Description" key={`tab_view_0`} />
                    <FilterPage tabLabel="Labels" key={`tab_view_1`} />
                </ScrollableTabView>
                <StartButton navigation={navigation} />
            </View>
        </CustomizedContainer>
    );
};

const StartButton = ({ navigation }) => {
    const { grantPermission } = useLabelmages();
    const onPressStart = () => {
        grantPermission(() => {
            push({ screen: 'ResultScreen', navigation });
        });
    };

    return (
        <View style={[styles.container_bar, styles.container_start]}>
            <TouchableOpacity activeOpacity={0.7} onPress={onPressStart}>
                <CustomizedContainer type="peach" containerStyle={SharedStyles.bar}>
                    <CustomizedText type="item" size={16}>
                        {Strings.start_processing}
                    </CustomizedText>
                </CustomizedContainer>
            </TouchableOpacity>
        </View>
    );
};

const DescriptionPage = deepMemo(() => {
    const { getTextDesc, setTextDesc } = useFilters();

    const onChangeText = text => {
        setTextDesc(text);
    };
    return (
        <TextInput
            style={styles.caption}
            onChangeText={onChangeText}
            placeholder={Strings.desc_place_holder}
            multiline={true}
            keyboardType={'default'}
        />
    );
});

const FilterPage = deepMemo(() => {
    const _renderTitle = () => (
        <CustomizedText type="title" textStyle={styles.text_title}>
            {Strings.title_input}
        </CustomizedText>
    );
    return (
        <View style={styles.container_page}>
            {_renderTitle()}
            <ListFilters />
            <InputFilters />
        </View>
    );
});

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
                placeholderTextColor={Colors.black_10}
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

export default deepMemo(InputScreen);
