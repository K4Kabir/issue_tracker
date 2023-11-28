/* eslint-disable */
import IconButton from '@mui/material/IconButton';
import {withStyles} from '@mui/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
class MTablePaginationInner extends React.Component {
  handleFirstPageButtonClick = (event) => {
    this.props.onPageChange(event, 0);
  };

  handleBackButtonClick = (event) => {
    this.props.onPageChange(event, this.props.page - 1);
  };

  handleNextButtonClick = (event) => {
    this.props.onPageChange(event, this.props.page + 1);
  };

  handleLastPageButtonClick = (event) => {
    this.props.onPageChange(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const {classes, count, page, rowsPerPage, theme, showFirstLastPageButtons} =
      this.props;
    const localization = {
      ...MTablePaginationInner.defaultProps.localization,
      ...this.props.localization,
    };

    return (
      <div className={classes.root}>
        {showFirstLastPageButtons && (
          <Tooltip title={localization.firstTooltip}>
            <span>
              <IconButton
                onClick={this.handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={localization.firstAriaLabel}
                size='large'
              >
                {theme?.direction === 'rtl' ? (
                  <LastPageIcon />
                ) : (
                  <FirstPageIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={localization.previousTooltip}>
          <span>
            <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label={localization.previousAriaLabel}
              size='large'
            >
              {theme?.direction === 'rtl' ? (
                <KeyboardArrowRightIcon />
              ) : (
                <KeyboardArrowLeftIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
        <Typography
          variant='caption'
          style={{
            flex: 1,
            textAlign: 'center',
            alignSelf: 'center',
            flexBasis: 'inherit',
          }}
        >
          {localization.labelDisplayedRows
            .replace(
              '{from}',
              this.props.count === 0
                ? 0
                : this.props.page * this.props.rowsPerPage + 1,
            )
            .replace(
              '{to}',
              Math.min(
                (this.props.page + 1) * this.props.rowsPerPage,
                this.props.count,
              ),
            )
            .replace('{count}', this.props.count)}
        </Typography>
        <Tooltip title={localization.nextTooltip}>
          <span>
            <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label={localization.nextAriaLabel}
              size='large'
            >
              {theme?.direction === 'rtl' ? (
                <KeyboardArrowLeftIcon />
              ) : (
                <KeyboardArrowRightIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
        {showFirstLastPageButtons && (
          <Tooltip title={localization.lastTooltip}>
            <span>
              <IconButton
                onClick={this.handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label={localization.lastAriaLabel}
                size='large'
              >
                {theme?.direction === 'rtl' ? (
                  <FirstPageIcon />
                ) : (
                  <LastPageIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>
    );
  }
}

const actionsStyles = (theme) => ({
  root: {
    flexShrink: 0,
    color: theme?.palette?.text?.secondary,
    display: 'flex',
    // lineHeight: '48px'
  },
});

MTablePaginationInner.propTypes = {
  onPageChange: PropTypes.func,
  page: PropTypes.number,
  count: PropTypes.number,
  rowsPerPage: PropTypes.number,
  classes: PropTypes.object,
  localization: PropTypes.object,
  theme: PropTypes.any,
  showFirstLastPageButtons: PropTypes.bool,
};

MTablePaginationInner.defaultProps = {
  showFirstLastPageButtons: true,
  localization: {
    firstTooltip: 'First Page',
    previousTooltip: 'Previous Page',
    nextTooltip: 'Next Page',
    lastTooltip: 'Last Page',
    labelDisplayedRows: '{from}-{to} of {count}',
    labelRowsPerPage: 'Rows per page:',
  },
};

const MTablePagination = withStyles(actionsStyles, {withTheme: true})(
  MTablePaginationInner,
);

export default MTablePagination;
