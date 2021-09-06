import Colors from '@utils/Colors';
import { StyleSheet } from 'react-native';
import { DefaultSize, TextSize } from '@utils/Constants';

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: TextSize.H2,
        marginBottom: DefaultSize.M,
        color: Colors.base_2,
        textAlign: 'center',
    },
    description: {
        color: Colors.black_12,
        textAlign: 'center',
        paddingHorizontal: DefaultSize.XL * 2,
    },
});
