import React, { useEffect, memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useFilters } from '@hooks';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, FilterItem } from '@components';
import SharedStyles from '@utils/SharedStyles';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { DefaultSize } from '@utils/Constants';
import Colors from '@utils/Colors';

const ListResults = () => {
    const [image, setImage] = React.useState([]);

    useEffect(() => {
        const listener = ImageLabeling.listen(res => {
            switch (res?.status) {
                case 'onResponse':
                    console.log(JSON.stringify(res, null, 2));
                    setImage(image => [...[res], ...image]);
                    break;
                case 'onFinish':
                    console.log('DONEEEE');
                    refAppOverlay?.current?.hide();
                    break;
            }
        });
        return () => {
            listener.remove();
        };
    }, []);

    const _renderItem = ({ item }) => <ItemResult item={item} />;

    const _renderFooter = () => {
        return <View style={styles.item_img}></View>;
    };

    return (
        <View style={styles.container_list}>
            <FlatList
                horizontal
                data={image}
                renderItem={_renderItem}
                ListFooterComponent={_renderFooter}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `key_${item?.uri} ${item?.pixelWidth} ${index}`}
            />
        </View>
    );
};

const ItemResult = memo(({ item }) => {
    const { uri = '', pixelWidth = 0, pixelHeight = 1, label = {} } = item || {};
    const aspectRatio = Math.max(0.8, pixelWidth / pixelHeight);
    const listLabels = Object.keys(label) || [];
    const _renderFooter = () => {
        return <View style={styles.item_img}></View>;
    };
    return (
        <TouchableOpacity style={styles.container_item} activeOpacity={0.7}>
            <Image source={{ uri }} style={[styles.item_img, { aspectRatio }]} />
            <FlatList
                data={listLabels}
                style={styles.container_filter}
                keyExtractor={(item, index) => `key_filter_${uri}_${item?.label}_${index}`}
                renderItem={({ item }) => {
                    return <FilterItem text={`#${item.toLowerCase()}`} disable={false} />;
                }}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={_renderFooter}
            />
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container_list: {
        flex: 1,
    },
    container_item: {
        ...SharedStyles.shadow,
        height: '70%',
        marginHorizontal: DefaultSize.S,
        backgroundColor: Colors.white,
        borderRadius: DefaultSize.M,
    },
    container_filter: {
        width: '100%',
    },
    item_img: {
        alignSelf: 'center',
        width: 'auto',
        height: '60%',
        borderTopRightRadius: DefaultSize.M,
        borderTopLeftRadius: DefaultSize.M,
        // backgroundColor: 'red',
    },
});

export default memo(ListResults);
