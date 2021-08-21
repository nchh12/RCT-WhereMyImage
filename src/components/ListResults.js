import React, { useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useFilters } from '@hooks';
import Strings from '@utils/Strings';
import { refAppOverlay } from '@navigation/AppOverlay';
import assets from '@assets';
import { CustomizedText, FilterItem } from '@components';
import SharedStyles from '@utils/SharedStyles';
import ImageLabeling from '@core/nativemodules/ImageLabeling';
import { DefaultSize } from '@utils/Constants';
import Colors from '@utils/Colors';
import { deepMemo } from 'use-hook-kits';

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

    const _renderItem = ({ item, index }) => <ItemResult item={item} index={index} />;

    const _renderFooter = () => {
        return <View style={styles.item_img}></View>;
    };

    return (
        <View style={styles.container}>
            <CustomizedText type="header" textStyle={styles.result_text}>
                Found {image?.length || 0} image{image?.length > 1 ? 's' : ''} matched!
            </CustomizedText>
            <FlatList
                horizontal
                style={styles.container_list}
                data={image} //need optimize here
                renderItem={_renderItem}
                ListFooterComponent={_renderFooter}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) =>
                    `key_${item?.uri} ${item?.pixelWidth} ${image?.length - index}`
                }
            />
        </View>
    );
};

const ItemResult = deepMemo(({ item }) => {
    const { uri = '', pixelWidth = 0, pixelHeight = 1, labels = {} } = item || {};
    const { isInEnableLabels } = useFilters();
    const aspectRatio = 1; //Math.max(0.8, pixelWidth / pixelHeight);
    const listLabels = Object.keys(labels)
        .map(key => {
            return {
                label: key,
                percent: parseInt((labels[key] || 0) * 100),
            };
        })
        .sort((a, b) => a.percent < b.percent);

    const _renderFooter = () => {
        return <View style={styles.item_img}></View>;
    };

    const onPressItem = () => {
        // refAppOverlay.current?.show({
        //     component: () => {
        //         return <ItemResult item={item} />;
        //     },
        // });
    };

    return (
        <TouchableOpacity style={styles.container_item} activeOpacity={0.8} onPress={onPressItem}>
            <Image source={{ uri }} style={[styles.item_img, { aspectRatio }]} />
            <View style={styles.container_filter}>
                <FlatList
                    data={listLabels}
                    keyExtractor={(item, index) => `key_filter_${uri}_${item?.label}_${index}`}
                    renderItem={({ item }) => {
                        const { label, percent } = item;
                        return (
                            <View style={styles.item_filter}>
                                <FilterItem
                                    text={`#${label?.toLowerCase()}: ${percent}%`}
                                    disable={!isInEnableLabels(label.toLowerCase())}
                                />
                            </View>
                        );
                    }}
                    scrollEnabled
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={_renderFooter}
                />
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    container_list: {
        paddingHorizontal: DefaultSize.L,
    },
    container_item: {
        marginTop: DefaultSize.L,
        ...SharedStyles.shadow,
        height: '90%',
        marginHorizontal: DefaultSize.S,
        backgroundColor: Colors.white,
        borderRadius: DefaultSize.M,
    },
    container_filter: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignSelf: 'flex-end',
        borderRadius: DefaultSize.S,
        backgroundColor: '#ffffff90',
    },
    item_filter: {
        alignSelf: 'flex-end',
    },
    item_img: {
        alignSelf: 'center',
        width: 'auto',
        height: '80%',
        borderTopRightRadius: DefaultSize.M,
        borderTopLeftRadius: DefaultSize.M,
    },
    result_text: {
        color: Colors.base_5,
        marginHorizontal: DefaultSize.XL,
    },
});

export default deepMemo(ListResults);
