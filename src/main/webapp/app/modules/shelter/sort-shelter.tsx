import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DEFAULT_SORT_ORDER, ORDER_ASC, ORDER_DESC } from 'app/shared/util/search-utils';

const SortShelter = props => {
  const values = props.values;
  const dropdownOpen = props.dropdownOpen;
  const toggleSort = props.toggleSort;
  const sort = props.sort;
  const order = props.order;
  const sortFunc = value => () => {
    let o = DEFAULT_SORT_ORDER;

    if (value === sort) {
      o = order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;
    }
    props.sortFunc(value, o);
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleSort}>
      <DropdownToggle color="primary" caret>
        <Translate contentKey="serviceNetApp.shelter.home.sort.toggle" />
      </DropdownToggle>
      <DropdownMenu right={false}>
        {values.map((value, i) => (
          <DropdownItem onClick={sortFunc(value)} key={`sortItem${i}`}>
            <Translate contentKey={`serviceNetApp.shelter.home.sort.${value}`} />{' '}
            {sort === value ? <FontAwesomeIcon icon={order === ORDER_ASC ? 'angle-up' : 'angle-down'} /> : null}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SortShelter;
