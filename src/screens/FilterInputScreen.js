import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import Strings from '@utils/Strings';
import assets from '../assets';
import { DefaultSize } from '@utils/Constants';
import { isLetters } from '@utils/StringUtils';

const FilterInputScreen = props => {
    const { navigation } = props;
    const [filters, setFilters] = useState([]);
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

    const removeItem = _index => {
        setFilters(filters.filter((item, index) => index !== _index));
    };

    const _renderTitle = () => (
        <CustomizedText type="title" textStyle={styles.text_title}>
            {Strings.title_input}
        </CustomizedText>
    );

    const _renderListFilters = () => {
        return (
            <View>
                <FlatList
                    style={styles.container_filter}
                    data={filters}
                    keyExtractor={(item, index) => `key_filter_${item}_${index}`}
                    renderItem={({ index, item }) => {
                        return (
                            <FilterItem
                                text={`${item}`}
                                onPress={() => {
                                    removeItem(index);
                                }}
                            />
                        );
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </View>
        );
    };

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
                    setFilters([`#${textFilter}`, ...filters]);
                    setTextFilter('');
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
                {_renderListFilters()}
                {_renderInputFilter()}
                {_renderButtonAdd()}
            </View>
        </CustomizedContainer>
    );
};

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

export default FilterInputScreen;
