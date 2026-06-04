package com.udong.posbackend.service;

import com.udong.posbackend.constant.Category;
import com.udong.posbackend.constant.Role;
import com.udong.posbackend.model.CafeTableEntity;
import com.udong.posbackend.model.ProductEntity;
import com.udong.posbackend.model.UserEntity;
import com.udong.posbackend.repository.CafeTableRepository;
import com.udong.posbackend.repository.ProductRepository;
import com.udong.posbackend.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SeedDefaultDataService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CafeTableRepository cafeTableRepository;
    private final ProductRepository productRepository;

    @PostConstruct
    @Transactional
    public void seedAllDefaultData() {
        seedDefaultUsers();
        seedDefaultCafeTables();
        seedInitialProducts();
    }

    private void seedDefaultUsers() {
        if (userRepository.count() == 0) {
            UserEntity defaultAdmin = UserEntity.builder()
                    .email("admin@nekobite.com")
                    .name("Admin Staff")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .emoji("🐾")
                    .build();
            userRepository.save(defaultAdmin);
            
            // Maid Yuna
            UserEntity yuna = UserEntity.builder()
                    .email("yuna@nekobite.com")
                    .name("Maid Yuna #01")
                    .password(passwordEncoder.encode("1111"))
                    .role(Role.MAID)
                    .emoji("🐱")
                    .build();
            userRepository.save(yuna);

            // Maid Rin
            UserEntity rin = UserEntity.builder()
                    .email("rin@nekobite.com")
                    .name("Maid Rin #02")
                    .password(passwordEncoder.encode("2222"))
                    .role(Role.MAID)
                    .emoji("🐰")
                    .build();
            userRepository.save(rin);

            // Maid Mei
            UserEntity mei = UserEntity.builder()
                    .email("mei@nekobite.com")
                    .name("Maid Mei #03")
                    .password(passwordEncoder.encode("3333"))
                    .role(Role.MAID)
                    .emoji("🦊")
                    .build();
            userRepository.save(mei);

            // Maid Koko
            UserEntity koko = UserEntity.builder()
                    .email("koko@nekobite.com")
                    .name("Maid Koko #04")
                    .password(passwordEncoder.encode("4444"))
                    .role(Role.MAID)
                    .emoji("🐻")
                    .build();
            userRepository.save(koko);

            // Chef Ryu
            UserEntity chef = UserEntity.builder()
                    .email("chef@nekobite.com")
                    .name("Chef Ryu")
                    .password(passwordEncoder.encode("5555"))
                    .role(Role.CHEF)
                    .emoji("🍳")
                    .build();
            userRepository.save(chef);
        }
    }

    private void seedDefaultCafeTables() {
        if (cafeTableRepository.count() == 0) {
            for (int i = 1; i <= 8; i++) {
                int seatSize = (i % 2 == 0) ? 4 : 2;
                CafeTableEntity table = CafeTableEntity.builder()
                        .tableNumber(String.valueOf(i))
                        .seatSize(seatSize)
                        .build();
                cafeTableRepository.save(table);
            }
        }
    }

    private void seedInitialProducts() {
        if (productRepository.count() == 0) {
            // Mains
            seedProduct("m1", "Neko Curry 🍛", "🍛", Category.MAINS, "14.50", 
                    "Cute sleeping cat-shaped rice swimming in our delicious house vegetable curry.", 12);
            seedProduct("m2", "Cyber Soy Ramen 🍜", "🍜", Category.MAINS, "16.00", 
                    "Traditional ramen with neon-pink narutomaki, ajitama egg, and glowing garlic oil.", 0);
            seedProduct("m3", "Moe Maid Omurice 🍳", "🍳", Category.MAINS, "13.50", 
                    "Fluffy Japanese omelette over seasoned rice, decorated with a ketchup heart and custom spell.", 8);
            seedProduct("m4", "Sakura Bento Box 🍱", "🍱", Category.MAINS, "18.00", 
                    "Premium pink bento featuring cherry blossom sushi, crispy shrimp tempura, and edamame.", 15);

            // Drinks
            seedProduct("d1", "Neko Matcha Latte 🍵", "🍵", Category.DRINKS, "6.50", 
                    "Creamy Uji matcha latte topped with cute frothy kitten paw latte art.", 20);
            seedProduct("d2", "Neon Boba Tea 🧋", "🧋", Category.DRINKS, "7.00", 
                    "Delicious sweet taro milk tea featuring glowing blue tapioca pearls.", 10);
            seedProduct("d3", "Strawberry Ramune 🥤", "🥤", Category.DRINKS, "5.55", 
                    "Fizzy, sweet Japanese soda inside the classic glass bottle with marble pop.", 15);
            seedProduct("d4", "Mana Potion Elixir 🧪", "🧪", Category.DRINKS, "8.00", 
                    "Refreshing blue curaçao lemonade served in an illuminated alchemist's flask.", 25);

            // Desserts
            seedProduct("de1", "Souffle Pancakes 🥞", "🥞", Category.DESSERTS, "11.00", 
                    "Fluffy, jiggly souffle pancakes with fresh whipped cream and honeycomb butter.", 6);
            seedProduct("de2", "Hanami Dango 🍡", "🍡", Category.DESSERTS, "6.00", 
                    "Trio of tri-colored sweet sticky rice dumplings skewered with sweet brown glaze.", 18);
            seedProduct("de3", "Kawaii Berry Parfait 🍧", "🍧", Category.DESSERTS, "9.50", 
                    "Tower of strawberry gelato, vanilla custard, crispy cornflakes, topped with bunny ears.", 12);
            seedProduct("de4", "Anko Taiyaki Waffle 🐟", "🐟", Category.DESSERTS, "7.00", 
                    "Traditional fish-shaped waffle with crispy edges and sweet warm red bean filling.", 10);

            // Merch
            seedProduct("me1", "Neko Maid Earbands 🐱", "🐱", Category.MERCH, "15.00", 
                    "Cosplay headband with soft plush pink ears, white lace, and cute matching ribbons.", 15);
            seedProduct("me2", "Holo Mascot Keyring 🔑", "🔑", Category.MERCH, "8.00", 
                    "Double-sided holographic acrylic keychain featuring our cute cyber mascot Neko-Chan.", 5);
            seedProduct("me3", "Cyber Cafe Poster 🖼️", "🖼️", Category.MERCH, "12.00", 
                    "Limited-edition neon-lit Akihabara maid bistro art print, signed by the artist.", 8);
            seedProduct("me4", "Signature Mascot Mug ☕", "☕", Category.MERCH, "14.00", 
                    "Collectable ceramic matte black mug that changes graphics when hot tea is added.", 20);
        }
    }

    private void seedProduct(String rawId, String name, String emoji, Category category, String price, 
                              String description, int stock) {
        BigDecimal sellPrice = new BigDecimal(price);
        BigDecimal cost = sellPrice.multiply(new BigDecimal("0.40")).setScale(2, java.math.RoundingMode.HALF_UP);
        ProductEntity product = ProductEntity.builder()
                .id(UUID.nameUUIDFromBytes(rawId.getBytes()))
                .name(name)
                .emoji(emoji)
                .imageUrl(null)
                .category(category)
                .price(sellPrice)
                .costPrice(cost)
                .description(description)
                .stockQuantity(stock)
                .lowStockThreshold(5)
                .build();
        productRepository.save(product);
    }
}
