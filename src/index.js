/*
 * Wire
 * Copyright (C) 2017 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.  * */
module.exports = function ({Plugin, types: t}) {
  list_of_ids = [];
  list_of_node = [];

  update_list_and_nodes = (name="") => {
    name !== "" && list_of_ids.push(name)
    for(let i=0; i<list_of_node.length; i++) {
      nnode = {...list_of_node[i]};
      nnode.node.name = list_of_ids.map(id =>'"'+id+'"').join(', ');
      list_of_node[i] = {...nnode}
    }
    console.log("called-------------------------", list_of_node.map(ddd => ddd.node.name))
  }
  return {
    visitor: {
      JSXElement({node}, {opts: {patterns = []}}) {
        const required_ID = node.openingElement.attributes.filter((attr) => attr.name && attr.name.name === 'id' )

        node.openingElement.attributes = node.openingElement.attributes
          .filter((attributeEntry) => !patterns.some((regex) => attributeEntry.name
            ? new RegExp(regex).test(attributeEntry.name.name)
            : false));

        required_ID.length && update_list_and_nodes(required_ID[0].value.value)
      },
      Identifier(path, {to_change = "HERE_COMES_THE_LIST_OF_IDS" }) {
        const name = path.node.name;
        if(name === to_change) {
          list_of_node.push(path)
          update_list_and_nodes()
        }
      },
    }
  };
}
