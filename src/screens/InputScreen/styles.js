import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize } from '@utils/Constants';
import SharedStyles from '@utils/SharedStyles';
import DeviceConfigs from '@utils/DeviceConfigs';

export default StyleSheet.create({
    foreground: {
        width: '90%',
        height: 'auto',
        marginTop: -DefaultSize.L,
    },
    container_overlay: {
        ...SharedStyles.shadow,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '75%',
        backgroundColor: Colors.white,
        paddingVertical: DefaultSize.L,
        borderTopLeftRadius: DefaultSize.XL,
        borderTopRightRadius: DefaultSize.XL,
    },
    container_page: {
        backgroundColor: Colors.white,
        marginHorizontal: DefaultSize.M,
        paddingVertical: DefaultSize.M,
        borderRadius: DefaultSize.S,

        ...SharedStyles.shadow,
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
        width: '80%',
        color: Colors.black_15,
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
    caption: {
        width: '100%',
        alignSelf: 'center',
        color: Colors.black_15,
        fontWeight: 'bold',
        paddingHorizontal: DefaultSize.M,
    },
});
