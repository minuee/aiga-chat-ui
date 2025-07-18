'use client';
import { Link } from '@/i18n/routing';
import { useTranslations,useLocale} from 'next-intl';
import { Box,Flex,Stack,useColorModeValue,} from '@chakra-ui/react';
import CustomText, { CustomTextBold700 } from "@/components/text/CustomText";

export default function NotFoundView() {

    const t = useTranslations('Messages');
    const isDark = useColorModeValue(false, true);
    const bgColor = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('#000000', 'white');
    const linkTextColor = useColorModeValue('green', 'green');

    return (
        <>
            <Flex flexDirection={'column'} alignItems={'center'} justifyContent={'center'} bg={bgColor} padding={"0 30px"} height='100vh'>
                <Flex flex={1} justifyContent={'center'} alignItems={'center'}>
                    {
                        isDark 
                        ?
                        <img src='/img/notfound3_dark.gif' alt='notfound' width='300' />
                        :
                        <img src='/img/notfound3.gif' alt='notfound' width='300' />
                    }
                    
                </Flex>
                <Flex flex={1} flexDirection={'column'} alignItems={'center'}>
                    {/* <h1 style={styles.code}>404</h1> */}
                    <Box margin='20px 0'>
                        <CustomText fontSize={'1.3rem'} color={textColor}>{t("notfound_msg")}</CustomText>
                    </Box>
                    <Link href="/" style={{textDecoration: 'none'}}>
                        <CustomTextBold700 fontSize={'1rem'} color={linkTextColor} textDecorationLine={'none'}>
                            {t("gotohome")}
                        </CustomTextBold700>
                    </Link>
                </Flex>
            </Flex>
        </>
    );
}

const styles = {
    notContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent : 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
        color: '#333',
        fontFamily: 'Noto Sans',
        padding : "0 30px"
    },
    imgWrapper : {
        display: 'flex',
        flex:1,
        alignItems: 'center',
        justifyContent : 'center',
    },
    textWrapper : {
        display: 'flex',
        flex:1,
        alignItems: 'center',
        flexDirection: 'column' as const,
    },
    code: {
        fontSize: '6rem',
        margin: 0,
    },
    notMessage: {
        fontSize: '1.2rem',
        margin: '20px 0',
    },
    notLink: {
        fontSize: '1rem',
        color: 'green',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
  };