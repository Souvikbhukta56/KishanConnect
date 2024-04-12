import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';
const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeLogo: {
        height: 300,
        width: 300,
    },
    welcomeLogoContainer: {
        position: 'absolute',
        width: width, 
        height: height, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeButton: {
        marginLeft: width / 2 - 100,
        width: 200, height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10
    },
    welcomeButtonGradient: {
        flexDirection: 'row',
        width: 200,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
    },
    welcomeButtonIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 12,
        borderWidth: .5,
        borderColor: Colors.black,
    },
    welcomeButtonTitle: {
        color: Colors.white,
        fontWeight: '500',
        marginLeft: 35,
        fontSize: 19
    },
    loginTextinput: {
        width: 200,
        marginLeft: 15,
        color: Colors.black,
    },
    loginTextInputContainer: {
        backgroundColor: Colors.white,
        marginTop: height * .04,
        height: 60,
        width: 280,
        borderRadius: 30,
        flexDirection: 'row'
    },
    loginIconStyle: {
        backgroundColor: '#202020',
        marginTop: 10,
        marginLeft: 12,
        height: 40,
        width: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButton: {
        marginTop: height * .03,
        width: 130,
        height: 45,
        borderRadius: 30,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButtonGradient: {
        width: 150,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registrationModal: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        height: height * .35,
        width: width * .7,
        marginLeft: '15%'
    },
    registrationIconContainer: {
        backgroundColor: '#28c380',
        marginTop: 10,
        marginLeft: 12,
        height: 30,
        width: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    registrationInputContainer: {
        backgroundColor: 'white',
        elevation: 5,
        height: 50,
        width: 280,
        borderRadius: 30,
        flexDirection: 'row',
    },
    registrationTextInput: {
        width: 200,
        marginLeft: 15,
        backgroundColor: 'white',
        color: Colors.black,
    },
    registrationModal: {
        width: width * .6,
        height: height * .3,
        alignItems: "center",
        marginLeft: '20%',
        backgroundColor: "white",
        borderRadius: 20,
        paddingRight: 25,
        paddingLeft: 25,
        elevation: 50
    },
    registrationTextInput1: {
        color: Colors.black,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white',
        padding: 10,
        width: 200,
        marginTop: 22
    },
    registrationModalButton: {
        height: 40,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        backgroundColor: '#28c380',
        elevation: 10,
        marginTop: '12%',
    },
    registrationButtonContainer: {
        width: 130,
        height: 45,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
    },
    header: {
        width: '100%',
        height: '11%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabbar: {
        backgroundColor: Colors.white,
        borderColor:Colors.black,
        borderWidth:.5
    },
    uploadPostContainer: {
        flexDirection: 'row',
        width: '94%',
        margin: '3%',
        marginBottom: '2%',
        marginTop: '2%',
        backgroundColor: Colors.white,
        borderRadius: 70,
        elevation: 8
    },
    logoBackground: {
        width: 46,
        height: 46,
        borderRadius: 28,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    farmerHomePrice: { 
        padding: 5, 
        marginBottom:5, 
        marginTop:5, 
        width: 200, 
        borderRadius:5, 
        backgroundColor:Colors.white,
        elevation: 5
    },
    farmerUploadImage: {
        width: 60,
        height: 60,
        margin: 15,
        elevation: 8,
        backgroundColor: Colors.lightMain,
        borderRadius: 30
    },
    imageContainer: {
        width: 100,
        height: 100,
        margin: 15,
        backgroundColor: Colors.lightMain,
        borderRadius: 5,
        elevation:8
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(100, 100, 100, 0.5)',
    },
    confirmBox: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    bigPlus: {
        backgroundColor: '#191c3e',
        position: 'absolute',
        left: width / 2 - 40,
        bottom: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 7
    },
    centeredView: {
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 25,
        elevation: 50,
        width: width * .8
    },
    textinput: {
        color: Colors.black,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: Colors.white,
        padding: 10,
        width: '100%',
        marginTop: 22
    },
    plusCentered: {
        height: 40,
        width: 70,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        backgroundColor: Colors.darkMain,
        elevation: 7,
        marginTop: '12%'
    },
    imagePicker: {
        borderRadius: 50,
        elevation: 5,
        backgroundColor: '#191c3e',
        padding: 10,
        width: '80%',
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '12%'
    },
    ratingStyle: {
        color: 'orange',
        fontWeight: '300',
        backgroundColor: 'white',
        borderRadius: 30,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        flexDirection: 'row',
    },
    soldItemsContainer: {
        flexDirection: 'row',
        width: '90%',
        margin: '5%',
        marginBottom: '1.5%',
        marginTop: '1.5%',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        borderRadius: 50,
        borderColor: Colors.darkMain,
        borderWidth: .7,
        backgroundColor: Colors.white,
        padding: 8,
        width: '100%',
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    star: {
        fontSize: height * .03,
        color: '#bebebe',
        lineHeight: 34,
        textAlign: 'center',
    },
    starFilled: {
        color: 'gold',
    },
    profileImage: {
        zIndex: 999,
        marginTop: 15,
        width: height * .18,
        height: height * .18,
        backgroundColor: Colors.lightMain,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileContainer: {
        position: 'absolute',
        top: height * .09 + 15,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
        padding: 10,
        paddingBottom: 200
    },
    informationsContainer: {
        backgroundColor:Colors.white,
        borderRadius: 20,
        padding: height * .01,
        marginTop: height * .02,
        width: width - 40,
        paddingLeft: 40,
        paddingBottom: 20
    },
    iconStyle: {
        height: height * .04,
        width: height * .04,
        borderRadius: height * .02,
        backgroundColor: Colors.mediumMain,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:5
    },
    item: {
        flexDirection: 'row',
        marginTop: height * .01,
        alignItems: 'center'
    },
    itemText: {
        color: Colors.black,
        marginLeft: 20,
        fontSize: 18
    },
    searchContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        borderRadius: 50,
        backgroundColor: 'white',
        height: '50%',
        width: '60%',
        alignItems: 'center'
    },
    searchInput: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        fontSize: 15,
        color: '#333',
    },
    retailerHomePricingContainer: {
        borderRadius: 10,
        padding: 5,
        paddingLeft: 15,
        marginTop: 3,
        marginButton: 3,
        width: width - 170,
        backgroundColor: Colors.white
    },
    selectButton: {
        padding: 8,
        paddingLeft: 13,
        paddingRight: 13,
        marginTop: 8,
        // borderColor: Colors.mediumMain,
        // borderWidth: 1,
        backgroundColor: Colors.mediumMain,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:8
    }
});