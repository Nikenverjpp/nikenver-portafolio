<?php
$lines = file('backend/app/Providers/AppServiceProvider.php');
for ($i = 0; $i < 6; $i++) {
    echo ($i + 1) . ': ' . bin2hex($lines[$i]) . ' | ' . str_replace(["\r", "\n"], ['\\r', '\\n'], $lines[$i]) . "\n";
}
