import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize, TextSize } from '@utils/Constants';
import SharedStyles from '@utils/SharedStyles';
import DeviceConfigs from '@utils/DeviceConfigs';

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        backgroundColor: Colors.base_2,
        borderRadius: DefaultSize.XL,
        padding: DefaultSize.XL,
    },
});
