import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize, TextSize } from '@utils/Constants';
import DeviceConfigs from '@utils/DeviceConfigs';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: DefaultSize.M,
        backgroundColor: Colors.white,
        paddingBottom: (DeviceConfigs.isIphoneX() ? DefaultSize.S : 0) + DefaultSize.XL,
        paddingHorizontal: DefaultSize.XL,
    },
    skip_text: {
        color: Colors.black_09,
        fontSize: TextSize.H4,
        fontWeight: 'bold',
    },
    next_text: {
        fontWeight: 'bold',
        color: Colors.base_2,
        fontSize: TextSize.H4,
    },
});
