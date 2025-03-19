import { forwardRef } from 'react';
import { Tappable, Subheadline } from '@telegram-apps/telegram-ui';
import { classNames } from '@telegram-apps/telegram-ui/dist/helpers/classNames';
import { hasReactNode } from '@telegram-apps/telegram-ui/dist/helpers/react/node';
import { usePlatform } from '@telegram-apps/telegram-ui/dist/hooks/usePlatform';

/**
 * CustomCell is an extension of the Cell component with additional features:
 * - Support for right-aligned text elements on the same line as left elements
 * - Support for buttons in the bottom section
 * - Flexible layout for more complex content arrangements
 */
export const CustomCell = forwardRef((props, ref) => {
  const {
    // Left section props
    subhead,
    children,
    subtitle,
    titleBadge,
    hint,

    // Right section props
    rightSubhead,
    rightTitle,
    rightSubtitle,

    // Common props
    description,
    className,

    // Layout sections
    before,
    after,
    bottom,

    // Styling props
    Component,
    hovered,
    multiline,

    ...restProps
  } = props;

  const platform = usePlatform();

  // Check if we have content for the different sections
  const hasLeftTitle = hasReactNode(children) || hasReactNode(hint) || hasReactNode(titleBadge);
  const hasRightContent = hasReactNode(rightSubhead) || hasReactNode(rightTitle) || hasReactNode(rightSubtitle) || hasReactNode(after);
  const hasBottomContent = hasReactNode(bottom);

  return (
    <Tappable
      ref={ref}
      Component={Component || 'div'}
      className={classNames(
        "tgui-b8dfba0b5c3d054c", // Base cell class
        platform === 'ios' && "tgui-7b5bccbb645b495f", // iOS specific styling
        hovered && "tgui-7edaaf0c57797623", // Hovered state
        multiline && "tgui-6c49dadccf648a5b", // Multiline support
        "custom-cell",
        hasBottomContent && "custom-cell-with-bottom", // Custom class for bottom content
        className
      )}
      {...restProps}
    >
      {/* Left icon/image section */}
      {hasReactNode(before) && (
        <div className="tgui-aaa795d78c356ac1 custom-cell-before">
          {before}
        </div>
      )}

      {/* Main content area with flexible layout */}
      <div className="custom-cell-content">
        {/* Subhead row */}
        {(hasReactNode(subhead) || hasReactNode(rightSubhead)) && (
          <div className="custom-cell-row">
            {hasReactNode(subhead) && (
              <Subheadline className="tgui-46dd90b57ffed25f custom-cell-left" level="2" weight="3">
                {subhead}
              </Subheadline>
            )}

            {hasReactNode(rightSubhead) && (
              <Subheadline className="tgui-46dd90b57ffed25f custom-cell-right" level="2" weight="3">
                {rightSubhead}
              </Subheadline>
            )}
          </div>
        )}

        {/* Title row */}
        {(hasLeftTitle || hasReactNode(rightTitle) || hasReactNode(after)) && (
          <div className="custom-cell-row">
            {hasLeftTitle && (
              <div className="tgui-a894f59f4c5ad72f custom-cell-left">
                {hasReactNode(children) && (
                  <span className="tgui-1c6d7865a76a19bc">{children}</span>
                )}

                {hasReactNode(hint) && (
                  <span className="tgui-bb909928b48f948b">{hint}</span>
                )}

                {hasReactNode(titleBadge) && titleBadge}
              </div>
            )}

            {hasReactNode(rightTitle) && (
              <div className="tgui-a894f59f4c5ad72f custom-cell-right">
                {rightTitle}
              </div>
            )}

            {!hasReactNode(rightTitle) && hasReactNode(after) && (
              <div className="custom-cell-right">
                {after}
              </div>
            )}
          </div>
        )}

        {/* Subtitle row */}
        {(hasReactNode(subtitle) || hasReactNode(rightSubtitle)) && (
          <div className="custom-cell-row">
            {hasReactNode(subtitle) && (
              <Subheadline className="tgui-d528ef65a8b76273 custom-cell-left" level="2" weight="3">
                {subtitle}
              </Subheadline>
            )}

            {hasReactNode(rightSubtitle) && (
              <Subheadline className="tgui-d528ef65a8b76273 custom-cell-right" level="2" weight="3">
                {rightSubtitle}
              </Subheadline>
            )}
          </div>
        )}

        {/* Description section */}
        {hasReactNode(description) && (
          <div className="tgui-fc059ed3ac5799a6 custom-cell-description">
            {description}
          </div>
        )}

        {/* Bottom section for buttons */}
        {hasBottomContent && (
          <div className="custom-cell-bottom">
            {bottom}
          </div>
        )}
      </div>
    </Tappable>
  );
});

// Add some inline styles for the custom classes
const style = document.createElement('style');
style.textContent = `
  .custom-cell {
    /* Override some of the original cell styles to ensure consistent padding */
    padding: 12px 16px;
  }

  .custom-cell-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    gap: 2px;
    overflow: hidden;
  }

  .custom-cell-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .custom-cell-left {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .custom-cell-right {
    text-align: right;
    flex-shrink: 0;
    min-width: 0;
  }

  .custom-cell-description {
    margin-top: 4px;
  }

  .custom-cell-bottom {
    margin-top: 12px;
  }

  .custom-cell-with-bottom {
    padding-bottom: 12px;
  }

  /* Adjust padding if there's a before element */
  .custom-cell-before {
    margin-right: 12px;
  }
`;

document.head.appendChild(style);
