<?php

declare(strict_types=1);

echo "Starting Professional Database Migration...\n";

$configFile = __DIR__ . '/myphp-db.php';
if (!file_exists($configFile)) {
    die("Error: myphp-db.php not found.\n");
}

$db = require $configFile;
$driver = $db['driver'] ?? 'mysql';

try {
    if ($driver === 'sqlite') {
        $dsn = 'sqlite:' . $db['sqlite_path'];
        $pdo = new PDO($dsn);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset']);
        $pdo = new PDO($dsn, $db['username'], $db['password']);
    }
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected to " . strtoupper($driver) . " database.\n";
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage() . "\n");
}

function createTable($pdo, $driver, $name, $sqliteFields, $mysqlFields) {
    // Drop existing table to ensure schema matches (WARNING: This deletes data in dev)
    // $pdo->exec("DROP TABLE IF EXISTS $name");

    $sql = $driver === 'sqlite'
        ? "CREATE TABLE IF NOT EXISTS $name ($sqliteFields)"
        : "CREATE TABLE IF NOT EXISTS $name ($mysqlFields) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $pdo->exec($sql);
    echo "Table '$name' ready.\n";
}

// 1. Users (Core Authentication)
createTable($pdo, $driver, 'users',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, display_name TEXT, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', status TEXT DEFAULT 'active', image TEXT, bio TEXT, info TEXT, about TEXT, skills TEXT, competencies TEXT, experience TEXT, education TEXT, projects TEXT, awards TEXT, languages TEXT, linkedin TEXT, github TEXT, twitter TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), display_name VARCHAR(255), email VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50) DEFAULT 'user', status VARCHAR(20) DEFAULT 'active', image TEXT, bio TEXT, info TEXT, about LONGTEXT, skills TEXT, competencies TEXT, experience TEXT, education TEXT, projects TEXT, awards TEXT, languages TEXT, linkedin VARCHAR(255), github VARCHAR(255), twitter VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 2. Services
createTable($pdo, $driver, 'services',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT, description TEXT, price REAL, image TEXT, gallery TEXT, video_url TEXT, rating REAL DEFAULT 5.0, reviews INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), category VARCHAR(100), description TEXT, price DECIMAL(10,2), image TEXT, gallery TEXT, video_url TEXT, rating DECIMAL(3,1) DEFAULT 5.0, reviews INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 2b. Top Services
createTable($pdo, $driver, 'top_services',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, icon TEXT, gallery TEXT, video_url TEXT, rating REAL DEFAULT 5.0, reviews INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), description TEXT, icon VARCHAR(100), gallery TEXT, video_url TEXT, rating DECIMAL(3,1) DEFAULT 5.0, reviews INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 3. Portfolio
createTable($pdo, $driver, 'portfolio',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT, description TEXT, image TEXT, link TEXT, client TEXT, duration TEXT, technologies TEXT, team_size TEXT, overview TEXT, features TEXT, results TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), category VARCHAR(100), description TEXT, image TEXT, link VARCHAR(255), client VARCHAR(255), duration VARCHAR(100), technologies TEXT, team_size VARCHAR(100), overview TEXT, features TEXT, results TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 4. Blogs
createTable($pdo, $driver, 'blogs',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, category TEXT, author TEXT, summary TEXT, content TEXT, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), category VARCHAR(100), author VARCHAR(100), summary TEXT, content LONGTEXT, image TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 5. FAQs
createTable($pdo, $driver, 'faqs',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, question TEXT, answer TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 6. Team
createTable($pdo, $driver, 'team',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, role TEXT, bio TEXT, email TEXT, image TEXT, sort_order INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), role VARCHAR(100), bio TEXT, email VARCHAR(255), image TEXT, sort_order INT DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 7. Orders
createTable($pdo, $driver, 'orders',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, service_id INTEGER, price REAL, status TEXT DEFAULT 'pending', project_description TEXT, assigned_to INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, service_id INT, price DECIMAL(10,2), status VARCHAR(50) DEFAULT 'pending', project_description TEXT, assigned_to INT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 8. Site Settings
createTable($pdo, $driver, 'site_settings',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, setting_key TEXT UNIQUE, setting_value TEXT",
    "id INT AUTO_INCREMENT PRIMARY KEY, setting_key VARCHAR(255) UNIQUE, setting_value LONGTEXT"
);

// 9. Live Chats
createTable($pdo, $driver, 'live_chats',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, guest_name TEXT, guest_email TEXT, session_id TEXT, assigned_to INTEGER, order_id INTEGER, status TEXT DEFAULT 'open', created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, guest_name VARCHAR(255), guest_email VARCHAR(255), session_id VARCHAR(255), assigned_to INT, order_id INT, status VARCHAR(50) DEFAULT 'open', created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// 10. Live Messages
createTable($pdo, $driver, 'live_messages',
    "id INTEGER PRIMARY KEY AUTOINCREMENT, chat_id INTEGER, sender_id INTEGER, message TEXT, image_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP",
    "id INT AUTO_INCREMENT PRIMARY KEY, chat_id INT, sender_id INT, message TEXT, image_path TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
);

// Insert Default Settings
$defaultSettings = [
    'site_name' => 'Az Meer(SMC-Private) Limited',
    'hero_title' => 'Innovative Software Solutions',
    'hero_subtitle' => 'Web, Mobile & Digital Marketing',
    '3d_blob_1' => '#2563eb',
    '3d_blob_2' => '#4f46e5',
    '3d_speed' => '1.0'
];

foreach ($defaultSettings as $key => $val) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
    $stmt->execute([$key, $val]);
}

// Insert default Admin if not exists
$adminEmail = 'admin@azmeer.com';
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$adminEmail]);
if (!$stmt->fetch()) {
    $hashedPassword = password_hash('admin123456', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['Admin', $adminEmail, $hashedPassword, 'admin']);
    echo "Default admin account created.\n";
}

// 11. Add More Sample Services
$sampleServices = [
    ['Web Development', 'Web', 'Full stack website development using React, Node, and SQL.', 1500, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'],
    ['Mobile App Development', 'Mobile', 'iOS and Android native apps with smooth UI/UX.', 2500, 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'],
    ['UI/UX Design', 'Design', 'Professional user interface and experience design.', 800, 'https://images.unsplash.com/photo-1561070791-2526d30994b5'],
    ['SEO Optimization', 'Marketing', 'Boost your ranking on Google and other search engines.', 500, 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1'],
    ['Digital Marketing', 'Marketing', 'Comprehensive social media and PPC campaigns.', 1200, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'],
    ['Logo Design', 'Design', 'Creative and unique brand identity and logos.', 300, 'https://images.unsplash.com/photo-1626785774573-4b799315345d'],
    ['Content Writing', 'Writing', 'High-quality articles and blog posts for your business.', 200, 'https://images.unsplash.com/photo-1455390582262-044cdead277a'],
    ['Social Media Management', 'Marketing', 'Manage your social presence and engage followers.', 600, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113']
];

foreach ($sampleServices as $s) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO services (title, category, description, price, image) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute($s);
}

// 12. Add Sample Freelancers/Team
$sampleTeam = [
    ['Az Meer', 'CEO & Founder', 'Experienced software architect and leader.', 'azmeer@azmeer.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'],
    ['Sarah Khan', 'Lead UI/UX Designer', 'Creative designer with 5+ years experience.', 'sarah@azmeer.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'],
    ['John Doe', 'Web Developer', 'Expert in React and Node.js.', 'john@azmeer.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'],
    ['Jane Smith', 'Marketing Specialist', 'SEO and Digital Marketing expert.', 'jane@azmeer.com', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2']
];

foreach ($sampleTeam as $t) {
    $stmt = $pdo->prepare("INSERT IGNORE INTO team (username, role, bio, email, image) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute($t);
}

// 13. Add Sample Top Services
$sampleTopServices = [
    ['I will build a professional full-stack web application', 'React, Node.js, and SQL expertise.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'],
    ['I will develop a high-performance flutter mobile app', 'Cross-platform iOS and Android excellence.', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'],
    ['I will design a modern and professional brand identity', 'Logo, typography, and color palette creation.', 'https://images.unsplash.com/photo-1572044162444-ad60f128bde7']
];

foreach ($sampleTopServices as $ts) {
    // Note: top_services table has (title, description, icon) - using icon column for image path
    $stmt = $pdo->prepare("INSERT IGNORE INTO top_services (title, description, icon) VALUES (?, ?, ?)");
    $stmt->execute($ts);
}

echo "\nMigration successful!\n";
