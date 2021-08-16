import React from 'react';
import { StyleSheet } from 'react-native';
import Colors from '@utils/Colors';
import SharedStyles from '@utils/SharedStyles';
import { DefaultSize } from '@utils/Constants';
import LinearGradient from 'react-native-linear-gradient';

const CustomizedContainer = ({ type = null, containerStyle = {}, children, angle = 45 }) => {
    const appliedType = styles[type] || {};
    const colors = appliedType?.backgroundColor?.length > 1 && appliedType?.backgroundColor;
    containerStyle = Array.isArray(containerStyle) ? containerStyle : [containerStyle];
    return (
        <LinearGradient
            style={[appliedType, ...containerStyle]}
            colors={colors || [Colors.white, Colors.white]}
            useAngle={true}
            angle={angle}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    main_screen: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: Colors.gradient_peach,
    },
    cell: {
        backgroundColor: Colors.gradient_peach,
        paddingHorizontal: DefaultSize.L,
        paddingVertical: DefaultSize.XS,
        borderRadius: DefaultSize.XL,
        alignItems: 'center',
    },
});

export default React.memo(CustomizedContainer);
