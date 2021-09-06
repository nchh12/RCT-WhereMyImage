import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize, TextSize } from '@utils/Constants';

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
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: DefaultSize.M,
    },
    skip_text: {
        color: Colors.border_color_gray,
        fontSize: TextSize.H4,
    },
    next_text: {
        color: Colors.base_2,
        fontSize: TextSize.H4,
    },
});
