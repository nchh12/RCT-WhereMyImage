import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize, TextSize } from '@utils/Constants';
import SharedStyles from '@utils/SharedStyles';
import DeviceConfigs from '@utils/DeviceConfigs';

export default StyleSheet.create({
    dot: {
        height: DefaultSize.M,
        borderRadius: DefaultSize.S,
        backgroundColor: Colors.base_2,
        marginHorizontal: DefaultSize.S,
    },
});
