import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Translate } from 'react-jhipster';
import { NavLink as Link } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';

export const SacramentoMenu = props =>
  props.isShelterOwner ? (
    <NavItem>
      <NavLink exact tag={Link} to="/my-shelters" className="d-flex align-items-center">
        <FontAwesomeIcon icon="list" />
        <span className="navbar-label">
          <Translate contentKey="global.menu.myShelters" />
        </span>
      </NavLink>
    </NavItem>
  ) : null;
