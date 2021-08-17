import React, { useEffect, useState, memo } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import Strings from '@utils/Strings';
import assets from '@assets';
import { DefaultSize } from '@utils/Constants';
import { isLetters } from '@utils/StringUtils';
import { useFilters } from '@hooks';

const FilterInputScreen = props => {
    const { navigation } = props;
    const { addFilter } = useFilters();
    const [textFilter, setTextFilter] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const onChangeText = text => {
        if (text.length && isLetters(text.slice(-1))) {
            return;
        }
        !isLetters(text) && setTextFilter(text);
    };

    const _renderTitle = () => (
        <CustomizedText type="title" textStyle={styles.text_title}>
            {Strings.title_input}
        </CustomizedText>
    );

    const _renderInputFilter = () => (
        <View style={styles.container_bar}>
            <TextInput
                style={styles.bar}
                onChangeText={onChangeText}
                value={textFilter}
                placeholder={Strings.input_filter_placeholder}
                numberOfLines={1}
                keyboardType={'default'}
            />
        </View>
    );

    const _renderButtonAdd = () => (
        <View style={styles.container_bar}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    addFilter(textFilter);
                    setTextFilter('');
                    // navigation.push('ProcessingScreen');
                }}
            >
                <CustomizedContainer type="cell" containerStyle={styles.bar}>
                    <CustomizedText type="item" size={18}>
                        {Strings.add_filter}
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
                {_renderInputFilter()}
                {_renderButtonAdd()}
            </View>
        </CustomizedContainer>
    );
};

const ListFilters = memo(() => {
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
                            text={`#${label}`}
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
    bar: {
        // ...SharedStyles.shadow,
        ...SharedStyles.bar,
    },
    text_title: {
        marginHorizontal: DefaultSize.L,
    },
    container_filter: {
        marginTop: DefaultSize.S,
        paddingHorizontal: DefaultSize.S,
        width: '100%',
        height: 'auto',
    },
});

export default memo(FilterInputScreen);
