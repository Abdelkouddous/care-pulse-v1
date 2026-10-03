# Multi-Stage Production Dockerfile for VitalBook Laravel API (AWS ECS Fargate)
# Stage 1: Build Composer Vendor
FROM composer:2.8 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --ignore-platform-reqs

# Stage 2: Production PHP 8.4-FPM + Nginx runtime
FROM php:8.4-fpm-alpine

# Install system dependencies & PostgreSQL / Redis extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    postgresql-dev \
    libzip-dev \
    icu-dev \
    libpng-dev \
    oniguruma-dev \
    curl \
    git \
    && docker-php-ext-install \
    pdo_pgsql \
    pgsql \
    bcmath \
    intl \
    opcache \
    zip \
    && pecl install redis \
    && docker-php-ext-enable redis

# Set working directory
WORKDIR /var/www/html

# Copy vendor from builder stage
COPY --from=vendor /app/vendor ./vendor

# Copy application source code
COPY . .

# Copy Nginx and Supervisor configuration
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set permissions for storage and bootstrap cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/up || exit 1

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
