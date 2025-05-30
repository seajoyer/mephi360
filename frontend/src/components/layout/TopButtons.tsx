import { SegmentedControl, IconButton, Subheadline } from '@telegram-apps/telegram-ui';
import { SegmentedControlItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/SegmentedControl/components/SegmentedControlItem/SegmentedControlItem";
import type { FC } from 'react';

import { Icon24Channel } from '@/icons/24/channel';
import { Icon24Iiks } from '@/icons/24/iiks';

export const TopButtons: FC = () => {
    return (
        <div
        style={{
            marginTop: '8px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
        }}
        >

            {/* Left IconButton */}
            <IconButton
                mode="gray"
                size="s"
                style={{
                    marginLeft: '8px',
                    position: 'absolute',
                    display: 'flex',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}
            >
                <Icon24Iiks />
            </IconButton>

            {/* Centered SegmentedControl */}
            <SegmentedControl
                style={{
                    width: 'calc(100% - 150px)',
                    opacity: 0,
                    minWidth: '190px',
                }}
            >
                <SegmentedControlItem
                    onClick={function noRefCheck() {}}
                    selected
                >
                    <Subheadline
                        level="2"
                    >
                        <span className='font-medium'>Учеба</span>
                    </Subheadline>

                </SegmentedControlItem>
                <SegmentedControlItem
                    onClick={function noRefCheck() {}}
                >
                    <Subheadline
                        level="2"
                    >
                        <span className='font-medium'>Актив</span>
                    </Subheadline>
                </SegmentedControlItem>
            </SegmentedControl>

            {/* Right IconButton */}
            <IconButton
                mode="gray"
                size="s"
                style={{
                    marginRight: '8px',
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                <Icon24Channel />
            </IconButton>
        </div>
    );
};
