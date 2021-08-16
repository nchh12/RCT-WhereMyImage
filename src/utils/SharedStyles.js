import { StyleSheet } from 'react-native';
import Colors from '@utils/Colors';
import { DefaultSize } from '@utils/Constants';

export default StyleSheet.create({
    shadow: {
        shadowColor: Colors.black_07,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: DefaultSize.XXS,
        shadowOpacity: 10,
        elevation: 5,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    center_horizontal: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    full_white: {
        flex: 1,
        backgroundColor: Colors.white,
    },
});
