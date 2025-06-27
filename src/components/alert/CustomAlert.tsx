import React from 'react';
import { AlertDialog, AlertDialogCloseButton,AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button, useColorModeValue } from '@chakra-ui/react';

type CustomAlertProps = {
    AppName: string;
    isShowAppname : boolean;
    bodyContent: any;
    footerContent : any;
    isOpen: boolean;
    closeText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
    isCentered?: boolean;
};
  
const CustomAlert = ({ AppName, isShowAppname = false , bodyContent, isOpen, onClose, onConfirm, closeText, confirmText, isCentered = false,footerContent }:CustomAlertProps) => {

    const confirmRef = React.useRef();
    const bgColor = useColorModeValue('white', 'navy.700');

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={confirmRef as any}
            onClose={() => onClose()}
            isCentered={isCentered}
        >
            <AlertDialogOverlay>
                <AlertDialogContent backgroundColor={bgColor}  maxW={{base : "90%", md:"400px"}}>
                    {/* <AlertDialogCloseButton onClick={() => onClose()}/> */}
                    {
                        isShowAppname && (
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                {AppName}
                            </AlertDialogHeader>
                        )
                    }
                    <AlertDialogBody>
                        {bodyContent}
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        {footerContent}
                            {/*      <Button ref={confirmRef as any} onClick={() => onClose()} id="button_close">
                            {closeText}
                        </Button>
                        <Button colorScheme='red' onClick={() => onConfirm()} ml={3} id="button_confirm">
                            {confirmText}
                        </Button> */}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
};

export default React.memo(CustomAlert);