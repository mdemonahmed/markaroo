<!--
 |
 | In $plugin you'll find an instance of Plugin class.
 | If you'd like can pass variable to this view, for example:
 |
 | return PluginClassName()->view( 'dashboard.index', [ 'var' => 'value' ] );
 |
-->

<?php ob_start() ?>

<div class="markaroo wrap markaroo-sample">

  <div class="markaroo-toc-content">
    <?php wpkirk_section(__('Config Menu', 'markaroo')); ?>

    <?php wpkirk_code("@/config/menus.php") ?>

    <?php wpkirk_section(__('Controller', 'markaroo')); ?>
    <?php wpkirk_code("@/plugin/Http/Controllers/Dashboard/DashboardController.php") ?>


    <?php wpkirk_code("echo \$plugin->Name . ' main view';") ?>
    <?php $str  = $plugin->Name . ' main view'; ?>
    <?php wpkirk_code($str, ['language' => 'txt']) ?>

    <?php wpkirk_section(__('PHP Version', 'markaroo')); ?>

    <?php wpkirk_code("echo phpversion();", ['eval' => true]) ?>

    <?php wpkirk_section(__('ReactJS Application', 'markaroo')); ?>

    <?php wpkirk_code("@/resources/assets/apps/app.tsx") ?>

    <?php wpkirk_code(
      htmlentities('<div id="react-app"></div>'),
      ['language' => 'html']
    ) ?>

    <div id="react-app"></div>

  </div>

  <?php wpkirk_toc('Boilerplate') ?>

</div>