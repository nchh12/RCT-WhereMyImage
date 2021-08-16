import React, { useEffect, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { useSelector, keySelector, useDispatch, actions } from '../context';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { CustomizedText, CustomizedContainer, FilterItem } from '@components';
import Strings from '@utils/Strings';
import assets from '../assets';
import { DefaultSize } from '@utils/Constants';

const FilterInputScreen = props => {
    const { navigation } = props;
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

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
                    data={['tess', 'tess', 'tess', 'tess', 'tess', 'tess', 'tess']}
                    keyExtractor={(item, index) => `key_filter_${item}_${index}`}
                    renderItem={({ index, item }) => {
                        return <FilterItem text={`${index} ${item}`} />;
                    }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
            </View>
        );
    };

    const _renderInputFilter = () => (
        <TextInput
            style={styles.input}
            // onChangeText={onChangeNumber}
            placeholder="Cat..."
            numberOfLines={1}
            keyboardType={'default'}
        />
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
    input: {
        width: '100%',
        height: 'auto',
        borderRadius: DefaultSize.S,
    },
    text_title: {
        marginHorizontal: DefaultSize.L,
    },
    container_filter: {
        marginTop: DefaultSize.L,
        paddingHorizontal: DefaultSize.S,
        width: '100%',
        height: 'auto',
    },
});

export default FilterInputScreen;
