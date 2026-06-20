<?php

namespace Markaroo\Console;

use Markaroo\WPBones\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
  protected $commands = [
    'Markaroo\Console\Commands\SimpleCommand',
    'Markaroo\Console\Commands\WordPressCommand',
  ];
}
