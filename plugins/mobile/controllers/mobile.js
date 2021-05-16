"use strict";
const _ = require("lodash");
/**
 * mobile.js controller
 *
 * @description: A set of functions called "actions" of the `mobile` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */
  tables: async (ctx) => {
    const rawBuilder = strapi.connections.default.raw(
      "select * from core_store;"
    );
    let response = await rawBuilder.then();
    if(process.env.NODE_ENV!=="development"){
      response=response.rows;
    }
    const finalInformation = {}
    response.map((e) =>
      {
        if(_.startsWith(e.key,"model_def_application::")){
          const value=JSON.parse(e.value)
          finalInformation[value.uid]={
            ...finalInformation[value.uid],
            collectionName: value.collectionName,
            kind: value.kind,
            name: value.info.name,
            description: value.info.description,          
          }
        }
        if(_.startsWith(e.key,
          "plugin_content_manager_configuration_content_types::application::"
        )){
          const value=JSON.parse(e.value)
          finalInformation[value.uid]={
            ...finalInformation[value.uid],
            defaultSortBy: value.settings.defaultSortBy,
            mainField: value.settings.mainField,
            defaultSortOrder: value.settings.defaultSortOrder,
            layout: value.layouts.list
          }
        }
      }
    );
    ctx.send({
      message: finalInformation
    });
  },
};
